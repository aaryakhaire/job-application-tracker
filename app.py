from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)
DB_NAME = "database.db"


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/init")
def init_db():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL,
            date_applied TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()
    return "Database initialized"


@app.route("/applications", methods=["GET"])
def get_applications():
    conn = get_db_connection()
    apps = conn.execute("SELECT * FROM applications").fetchall()
    conn.close()
    return jsonify([dict(app) for app in apps])


@app.route("/applications", methods=["POST"])
def add_application():
    data = request.get_json()

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO applications (company, role, status, date_applied) VALUES (?, ?, ?, ?)",
        (data["company"], data["role"], data["status"], data["date_applied"])
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Application added"})


@app.route("/applications/<int:id>", methods=["DELETE"])
def delete_application(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM applications WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted"})


if __name__ == "__main__":
    app.run(debug=True)
