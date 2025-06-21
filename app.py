# app.py-3
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import requests
import os
import json
import datetime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    jwt_required, 
    get_jwt_identity, get_jwt
)
from flask_jwt_extended import JWTManager, create_access_token
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)
CORS(app)
# Setup Bcrypt for password hashing
bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this for production
jwt = JWTManager(app)
# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Different from app secret
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=3)  # Token expiration

# Initialize database
def init_db():
    conn = sqlite3.connect('coursemate.db')
    c = conn.cursor()
    
    # Create courses table
    c.execute('''
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT,
        description TEXT,
        intro_video TEXT,
        free_resources TEXT,
        paid_resources TEXT
    )
    ''')
    
    # Create placement_resources table
    c.execute('''
    CREATE TABLE IF NOT EXISTS placement_resources (
        id INTEGER PRIMARY KEY,
        company TEXT NOT NULL,
        resource_link TEXT NOT NULL
    )
    ''')
    
    # Create users table for future expansion
    c.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create quizzes table with external_link column
    c.execute('''
    CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY,
        course_id INTEGER,
        title TEXT NOT NULL,
        external_link TEXT,
        FOREIGN KEY (course_id) REFERENCES courses (id)
    )
    ''')
    
    # Create quiz_questions table
    c.execute('''
    CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY,
        quiz_id INTEGER,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
    )
    ''')
    
    conn.commit()
    
    # Check if data already exists to avoid duplication
    c.execute("SELECT COUNT(*) FROM courses")
    count = c.fetchone()[0]
    
    if count == 0:
        # Seed initial course data
        seed_courses(conn)
        # Seed placement resources
        seed_placement_resources(conn)
        # Seed quizzes
        seed_quizzes(conn)
    else:
        # Just update the quiz with external link if needed
        update_quiz_external_link(conn)
    
    conn.close()

def seed_courses(conn):
    c = conn.cursor()
    
    courses = [
        # Programming Languages
        {
            "title": "Introduction to Programming",
            "category": "Programming Languages",
            "description": "Learn the fundamentals of programming concepts and logic.",
            "intro_video": "https://www.youtube.com/embed/WGHG2wCq-6E?si=-TuAaQPKNB6N1crY",
            "free_resources": json.dumps([
                {"title": "Udemy Free Course", "link": "https://tinyurl.com/mpc7jhry"},
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/24bentmr"},
                {"title": "Coursera", "link": "https://tinyurl.com/y6wbvz3d"},
                {"title": "GeeksforGeeks", "link": "https://tinyurl.com/yc6nrvsh"},
                {"title": "BBC", "link": "https://tinyurl.com/yuff77cf"}
            ]),
            "paid_resources": json.dumps([])
        },
        {
            "title": "C Language",
            "category": "Programming Languages",
            "description": "Master the C programming language, widely used for system programming.",
            "intro_video": "https://www.youtube.com/embed/gEJBFKDkqTE?si=2Ibl3TDoa83EjEW-",
            "free_resources": json.dumps([
                {"title": "Udemy Free Course", "link": "https://tinyurl.com/2cjxpbdd"},
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/mudxmhxt"},
                {"title": "MIT OpenCourseware", "link": "https://tinyurl.com/2p9tj8b8"},
                {"title": "Udacity", "link": "https://tinyurl.com/yc6mkmvh"},
                {"title": "YouTube Extended Course", "link": "https://tinyurl.com/3e3jy9fa"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Coursera", "link": "https://tinyurl.com/5n72mvpd"},
                {"title": "Udemy Premium", "link": "https://tinyurl.com/v8sdzbtk"},
                {"title": "Codecademy", "link": "https://tinyurl.com/3fymwmrh"}
            ])
        },
        {
            "title": "Python",
            "category": "Programming Languages",
            "description": "Learn Python, one of the most popular and versatile programming languages.",
            "intro_video": "https://www.youtube.com/embed/WvhQhj4n6b8?si=lTTPLsGdiCztk5Q1",
            "free_resources": json.dumps([
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/mr3caee8"},
                {"title": "Udacity", "link": "https://tinyurl.com/sbtdpc49"},
                {"title": "YouTube Extended Course", "link": "https://tinyurl.com/mr2x8kum"},
                {"title": "Khan Academy", "link": "https://tinyurl.com/bzxa4ney"},
                {"title": "SoloLearn", "link": "https://tinyurl.com/3bkzeb67"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Coursera", "link": "https://tinyurl.com/mr3caee8"},
                {"title": "Internshala", "link": "https://tinyurl.com/4fp685mx"},
                {"title": "Udemy Premium", "link": "https://tinyurl.com/4994dktr"}
            ])
        },
        
        # Web Development
        {
            "title": "HTML and CSS",
            "category": "Web Development",
            "description": "Learn the building blocks of web development with HTML and CSS.",
            "intro_video": "https://www.youtube.com/embed/LGQuIIv2RVA?si=dYEGyMmZGg53-tON",
            "free_resources": json.dumps([
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/2suh26ny"},
                {"title": "Codecademy", "link": "https://tinyurl.com/ybnpjp4j"},
                {"title": "Shiksha", "link": "https://tinyurl.com/5fj3nnjm"},
                {"title": "Udacity", "link": "https://tinyurl.com/54hr8hyp"},
                {"title": "YouTube Extended Course", "link": "https://tinyurl.com/3zf3e9xs"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Udemy Premium", "link": "https://tinyurl.com/yrs7bvz2"},
                {"title": "Guvi", "link": "https://tinyurl.com/5anm5nbb"},
                {"title": "TutorialsPoint", "link": "https://tinyurl.com/3hkeeb8b"}
            ])
        },
        {
    "title": "React.js",
    "category": "Web Development",
    "description": "Master React.js, a popular JavaScript library for building user interfaces.",
    "intro_video": "https://www.youtube.com/embed/Y6aYx_KKM7A?si=VN3wUYBlc6iT12_8",
    "free_resources": json.dumps([
        {"title": "Codecademy", "link": "https://tinyurl.com/5e5abyrn"},
        {"title": "Scaler", "link": "https://tinyurl.com/4vav5pdv"},
        {"title": "YouTube Tutorial", "link": "https://tinyurl.com/5c57uvn5"},
        {"title": "Great Learning", "link": "https://tinyurl.com/ne5eb8ke"},
        {"title": "React Tutorial", "link": "https://tinyurl.com/mrxhcku3"}
    ]),
    "paid_resources": json.dumps([
        {"title": "Udemy Premium", "link": "https://tinyurl.com/bdf4kxds"},
        {"title": "Coursera", "link": "https://tinyurl.com/356949xr"},
        {"title": "Internshala", "link": "https://tinyurl.com/3a7853pu"}
    ])
},
        
        # Popular Courses
        {
            "title": "Data Science",
            "category": "Popular Courses",
            "description": "Learn data analysis, visualization, and machine learning techniques.",
            "intro_video": "https://www.youtube.com/embed/RBSUwFGa6Fk?si=ajY5FhDWOOajugWu",
            "free_resources": json.dumps([
                {"title": "Great Learning", "link": "https://tinyurl.com/4t6evhm4"},
                {"title": "IBM Skillbuild", "link": "https://tinyurl.com/y4dsjmr3"},
                {"title": "MindLuster", "link": "https://tinyurl.com/3mj9amfn"},
                {"title": "Scaler", "link": "https://tinyurl.com/4yvpcz28"},
                {"title": "Simplilearn", "link": "https://tinyurl.com/2rne29uh"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Udemy Premium", "link": "https://tinyurl.com/2xdacfj5"},
                {"title": "Internshala", "link": "https://tinyurl.com/2s46hntp"},
                {"title": "edX", "link": "https://tinyurl.com/bdet5ruf"}
            ])
        },
        {
            "title": "Generative AI",
            "category": "Popular Courses",
            "description": "Explore the cutting-edge field of generative artificial intelligence.",
            "intro_video": "https://www.youtube.com/embed/NRmAXDWJVnU?si=gQxf0eUtYSQ1J6eR",
            "free_resources": json.dumps([
                {"title": "Udemy Free Course", "link": "https://tinyurl.com/3ce68bpm"},
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/mufm58ra"},
                {"title": "Infosys Springboard", "link": "https://tinyurl.com/mrmxr2n2"},
                {"title": "GeeksforGeeks", "link": "https://tinyurl.com/4392tdx2"},
                {"title": "LinkedIn Learning", "link": "https://tinyurl.com/37ttny7h"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Internshala", "link": "https://tinyurl.com/mz259rp5"},
                {"title": "Great Learning", "link": "https://tinyurl.com/2kdy8urk"},
                {"title": "Guvi", "link": "https://tinyurl.com/hjj7j8jw"}
            ])
        },
        
        # Database Courses
        {
            "title": "SQL",
            "category": "Database",
            "description": "Learn Structured Query Language for managing and querying databases.",
            "intro_video": "https://www.youtube.com/embed/2bW3HuaAUcY?si=5S8oW6muNTTrcVK1",
            "free_resources": json.dumps([
                {"title": "Udacity", "link": "https://tinyurl.com/3reat7un"},
                {"title": "SQL Bolt", "link": "https://tinyurl.com/3zecukbn"},
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/4xcavp6d"},
                {"title": "SQL Course", "link": "https://tinyurl.com/5n7yv5bh"},
                {"title": "SQL Zoo", "link": "https://tinyurl.com/bdz75cpb"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Udemy Premium", "link": "https://tinyurl.com/4mmwhz8r"},
                {"title": "Coursera", "link": "https://tinyurl.com/22tky9kk"},
                {"title": "Intellipaat", "link": "https://tinyurl.com/4bpf6vsx"}
            ])
        },
        {
            "title": "MongoDB",
            "category": "Database",
            "description": "Master MongoDB, a popular NoSQL database for modern applications.",
            "intro_video": "https://www.youtube.com/embed/ofme2o29ngU?si=XexOe3u6MTQrOdV8",
            "free_resources": json.dumps([
                {"title": "Codecademy", "link": "https://tinyurl.com/yc526rtw"},
                {"title": "MongoDB University", "link": "https://tinyurl.com/26hmr23c"},
                {"title": "YouTube Tutorial", "link": "https://tinyurl.com/ya9ycv36"},
                {"title": "Great Learning", "link": "https://tinyurl.com/dtj4scp3"},
                {"title": "Simplilearn", "link": "https://tinyurl.com/4dc23wvd"}
            ]),
            "paid_resources": json.dumps([
                {"title": "Udemy Premium", "link": "https://tinyurl.com/2s3h9avm"},
                {"title": "Coursera", "link": "https://tinyurl.com/yfa7ff43"},
                {"title": "Pluralsight", "link": "https://tinyurl.com/33tm7nx3"}
            ])
        }
    ]
    
    for course in courses:
        c.execute('''
        INSERT INTO courses (title, category, description, intro_video, free_resources, paid_resources)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            course['title'], 
            course['category'], 
            course['description'], 
            course['intro_video'], 
            course['free_resources'], 
            course['paid_resources']
        ))
    
    conn.commit()

def seed_placement_resources(conn):
    c = conn.cursor()
    
    placement_resources = [
        {"company": "TCS", "resource_link": "https://drive.google.com/openid=1XN8w1Q9akk1IagpaSPDKVowlVCQJ1tV8"},
        {"company": "CTS", "resource_link": "https://drive.google.com/open?id=1a-HWjvdfAb4t3xo0O_R8_kwlqGs6Ipt-"},
        {"company": "Tech Mahindra", "resource_link": "https://drive.google.com/openid=1XN8w1Q9akk1IagpaSPDKVowlVCQJ1tV8"},
        {"company": "Wipro", "resource_link": "https://drive.google.com/open?id=15WDPKzntkQ0ux1-qXZhQ6MQ-IjSgYZWE"},
        {"company": "Infosys", "resource_link": "https://drive.google.com/open?id=1A0so4BGzkynu4k9T0hl-c6yokMBlMQiF"},
        {"company": "Mindtree", "resource_link": "https://drive.google.com/open?id=1dkBNs61BGmaQ8bvMDMlNO2ENDtCcNSdp"},
        {"company": "Value Labs", "resource_link": "https://drive.google.com/open?id=1MC6LwK5zoTIDkmjZHgm2TxnHPGxGnrHJ"},
        {"company": "Mphasis", "resource_link": "https://drive.google.com/open?id=1s4ExADXgIicpTaNjLj5Et6yv4UaPqXaT"},
        {"company": "ZenQ", "resource_link": "https://drive.google.com/open?id=1FjZxLhhMSNhnkru1pZEGjD1-w8XJPTZQ"},
        {"company": "EPAM", "resource_link": "https://drive.google.com/open?id=14kYwuvk3DiCp_c67Qhdm5j8MQ9ctPmRm"},
        {"company": "AMCAT", "resource_link": "https://drive.google.com/open?id=1vPCyQnc844BK9jsTKQ7WIzcGpx3r3J-d"},
        {"company": "eLitmus", "resource_link": "https://drive.google.com/open?id=154gp-J7a43zDe2lwvwZPQ0uvEnU7SYF1"},
        {"company": "Talent Battle", "resource_link": "https://drive.google.com/open?id=1wIUuyPIS41jKHTrA_1RyMX1hBNWJ0TFS"},
        {"company": "TR & HR Preparation", "resource_link": "https://drive.google.com/open?id=1jkLdSlyv-zAx3a8G-EZ38eXQV_AGjci4"}
    ]
    
    for resource in placement_resources:
        c.execute('''
        INSERT INTO placement_resources (company, resource_link)
        VALUES (?, ?)
        ''', (resource['company'], resource['resource_link']))
    
    conn.commit()

#------------------------------------------------------------------------------------------------------------------------------------------
def update_quiz_external_link(conn):
    c = conn.cursor()
    quizzes = [
        ("MongoDB", "https://forms.gle/SVia7CHKasmfTsBD7"),
        ("Introduction to Programming", "https://forms.gle/rHemMThiKaVgAzay9"),
        ("C Language", "https://forms.gle/BXZ7jviP361q3AXA7"),
        ("Python", "https://forms.gle/32AfYY5RVmA6QxSo9"),
        ("HTML and CSS", "https://forms.gle/2BEp2UQwRzp9HFcA9"),
        ("React.js", "https://forms.gle/L5oqzP7zZjncNxet8"),
        ("Data Science", "https://forms.gle/jGASC92qRcZMtE7X8"),
        ("Generative AI", "https://forms.gle/c1PjPWCPTKb9VR4QA"),
        ("SQL", "https://forms.gle/TBFPfNn5EZZ8dnv68")
    ]

    for title, quiz_link in quizzes:
        c.execute("SELECT id FROM courses WHERE title = ?", (title,))
        course = c.fetchone()
        if not course:
            print(f"Skipping {title}: Course not found")
            continue  # Skip if course not found

        course_id = course[0]

        # Check if quiz already exists
        c.execute("SELECT id FROM quizzes WHERE course_id = ?", (course_id,))
        quiz = c.fetchone()

        if quiz:
            c.execute("UPDATE quizzes SET external_link = ? WHERE id = ?", (quiz_link, quiz[0]))
            print(f"Updated quiz for {title}")
        else:
            c.execute("INSERT INTO quizzes (course_id, title, external_link) VALUES (?, ?, ?)", 
                      (course_id, f"{title} Quiz", quiz_link))
            print(f"Inserted quiz for {title}")

    conn.commit()
    
#------------------------------------------------------------------------------------------------------------------------------------


# Create database tables before first app run if they don't exist
# Create database tables before first app run if they don't exist
if not os.path.exists('coursemate.db'):
    init_db()
else:
    # Just update the quiz external link in existing database
    conn = sqlite3.connect('coursemate.db')
    update_quiz_external_link(conn)
    conn.close()

def validate_video_url(url):
    """Check if a URL is a valid video source"""
    if not url:
        return None
    
    # Ensure URLs use https for security
    if url.startswith('http:'):
        url = url.replace('http:', 'https:', 1)
    
    # Handle YouTube shortlinks (youtu.be)
    if 'youtu.be' in url:
        video_id = url.split('/')[-1].split('?')[0]
        return f"https://www.youtube.com/embed/{video_id}"
    
    # Handle standard YouTube URLs
    if 'youtube.com/watch' in url:
        parsed_url = urlparse(url)
        video_id = parse_qs(parsed_url.query).get('v', [None])[0]
        if video_id:
            return f"https://www.youtube.com/embed/{video_id}"
    
    # Already an embed URL
    if 'youtube.com/embed' in url:
        return url
    
    # Return original URL if it doesn't match known patterns
    return url

# API routes
@app.route('/api/courses', methods=['GET'])
def get_courses():
    category = request.args.get('category', None)
    
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    if category:
        c.execute("SELECT * FROM courses WHERE category = ?", (category,))
    else:
        c.execute("SELECT * FROM courses")
    
    courses = [dict(row) for row in c.fetchall()]
    
    # Parse JSON strings back to objects
    for course in courses:
        if course['free_resources']:
            course['free_resources'] = json.loads(course['free_resources'])
        if course['paid_resources']:
            course['paid_resources'] = json.loads(course['paid_resources'])
    
    conn.close()
    
    return jsonify(courses)

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    course = c.fetchone()
    
    if not course:
        conn.close()
        return jsonify({"error": "Course not found"}), 404
    
    course = dict(course)
    
    # Validate and fix video URL
    course['intro_video'] = validate_video_url(course['intro_video'])
    
    # Parse JSON strings back to objects
    if course['free_resources']:
        course['free_resources'] = json.loads(course['free_resources'])
    if course['paid_resources']:
        course['paid_resources'] = json.loads(course['paid_resources'])
    
    conn.close()
    
    return jsonify(course)

@app.route('/api/placement-resources', methods=['GET'])
def get_placement_resources():
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT * FROM placement_resources")
    resources = [dict(row) for row in c.fetchall()]
    
    conn.close()
    
    return jsonify(resources)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT DISTINCT category FROM courses")
    categories = [dict(row)['category'] for row in c.fetchall()]
    
    conn.close()
    
    return jsonify(categories)

@app.route('/api/quizzes/course/<int:course_id>', methods=['GET'])
def get_course_quiz(course_id):
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # Get quiz for the course
    c.execute("SELECT * FROM quizzes WHERE course_id = ?", (course_id,))
    quiz = c.fetchone()
    
    if not quiz:
        conn.close()
        return jsonify({"error": "No quiz found for this course"}), 404
    
    quiz_data = dict(quiz)
    
    # Get questions for the quiz
    c.execute("SELECT * FROM quiz_questions WHERE quiz_id = ?", (quiz_data['id'],))
    questions = [dict(row) for row in c.fetchall()]
    
    # Remove correct answers from the response to prevent cheating
    for q in questions:
        q.pop('correct_answer', None)
    
    quiz_data['questions'] = questions
    
    conn.close()
    
    return jsonify(quiz_data)
# Signup Route
@app.route('/api/signup', methods=['POST'])
def signup():
    required_fields = ['username', 'email', 'password']
    if not all(field in request.json for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    # Basic validation
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    conn = None
    try:
        conn = sqlite3.connect('coursemate.db')
        c = conn.cursor()
        
        # Check if user exists
        c.execute("SELECT 1 FROM users WHERE username = ? OR email = ?", 
                 (username, email))
        if c.fetchone():
            return jsonify({"error": "Username or email already exists"}), 409

        # Create user
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
        c.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_pw)
        )
        user_id = c.lastrowid
        
        # Generate token
        token = create_access_token(
            identity=user_id,
            additional_claims={
                'username': username,
                'email': email,
                'role': 'user'
            }
        )

        conn.commit()
        
        return jsonify({
            "message": "User created successfully",
            "token": token,
            "user": {
                "id": user_id,
                "username": username,
                "email": email
            }
        }), 201

    except sqlite3.Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()

# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    # Validate input
    if not request.json or 'password' not in request.json:
        return jsonify({"error": "Missing required fields"}), 400

    identifier = request.json.get('username') or request.json.get('email')
    password = request.json['password']

    if not identifier:
        return jsonify({"error": "Username or email required"}), 400

    conn = None
    try:
        conn = sqlite3.connect('coursemate.db')
        c = conn.cursor()
        
        # Search by username or email
        c.execute("SELECT * FROM users WHERE username = ? OR email = ?", 
                 (identifier, identifier))
        user = c.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not bcrypt.check_password_hash(user[3], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Generate token with additional claims
        token = create_access_token(
            identity=user[0],
            additional_claims={
                'username': user[1],
                'email': user[2],
                'role': 'user'  # Add role if you have different user types
            },
            expires_delta=datetime.timedelta(hours=3)
        )

        return jsonify({
            "token": token,
            "user": {
                "id": user[0],
                "username": user[1],
                "email": user[2]
            }
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if conn:
            conn.close()


# Protected route example
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    
    return jsonify({
        "message": "Protected content",
        "user_id": current_user_id,
        "username": claims.get('username'),
        "email": claims.get('email')
    }), 200

# User profile route
@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    
    conn = sqlite3.connect('coursemate.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT id, username, email, created_at FROM users WHERE id = ?", (user_id,))
    user = c.fetchone()
    
    conn.close()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(dict(user)), 200

# Logout route (token invalidation)
@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    # In a production app, you would add this to a token blacklist
    return jsonify({"message": "Successfully logged out"}), 200

# Run the application
if __name__ == '__main__':
    app.run(debug=True)





