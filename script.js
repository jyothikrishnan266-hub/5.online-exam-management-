// ========================================
// DATA
// ========================================

let questions =
    JSON.parse(
        localStorage.getItem("examQuestions")
    ) || [

        {
            id: 1,
            text: "Which data structure follows FIFO?",
            options: {
                A: "Stack",
                B: "Queue",
                C: "Tree",
                D: "Graph"
            },
            correct: "B",
            subject: "Data Structures",
            difficulty: "Easy"
        },

        {
            id: 2,
            text: "Which language is used for web page structure?",
            options: {
                A: "HTML",
                B: "SQL",
                C: "Python",
                D: "Java"
            },
            correct: "A",
            subject: "Web Development",
            difficulty: "Easy"
        },

        {
            id: 3,
            text: "Which normal form removes partial dependency?",
            options: {
                A: "1NF",
                B: "2NF",
                C: "3NF",
                D: "BCNF"
            },
            correct: "B",
            subject: "DBMS",
            difficulty: "Medium"
        },

        {
            id: 4,
            text: "Which protocol is used for secure web communication?",
            options: {
                A: "HTTP",
                B: "FTP",
                C: "HTTPS",
                D: "SMTP"
            },
            correct: "C",
            subject: "Computer Networks",
            difficulty: "Easy"
        },

        {
            id: 5,
            text: "Which algorithm is commonly used for shortest path?",
            options: {
                A: "Dijkstra",
                B: "Bubble Sort",
                C: "Binary Search",
                D: "Merge Sort"
            },
            correct: "A",
            subject: "Algorithms",
            difficulty: "Medium"
        }

    ];


let exams =
    JSON.parse(
        localStorage.getItem("onlineExams")
    ) || [];


let results =
    JSON.parse(
        localStorage.getItem("examResults")
    ) || [];


let activeExam = null;
let timerInterval = null;
let remainingSeconds = 0;


// ========================================
// SAVE DATA
// ========================================

function saveData() {

    localStorage.setItem(
        "examQuestions",
        JSON.stringify(questions)
    );

    localStorage.setItem(
        "onlineExams",
        JSON.stringify(exams)
    );

    localStorage.setItem(
        "examResults",
        JSON.stringify(results)
    );
}


// ========================================
// QUESTION BANK
// ========================================

function displayQuestionBank() {

    const container =
        document.getElementById("questionBank");

    const search =
        document
            .getElementById("questionSearch")
            .value
            .toLowerCase();

    const subject =
        document.getElementById("subjectFilter").value;

    const difficulty =
        document.getElementById("difficultyFilter").value;


    const filtered =
        questions.filter(q => {

            const searchMatch =
                q.text
                    .toLowerCase()
                    .includes(search);

            const subjectMatch =
                subject === "all" ||
                q.subject === subject;

            const difficultyMatch =
                difficulty === "all" ||
                q.difficulty === difficulty;

            return (
                searchMatch &&
                subjectMatch &&
                difficultyMatch
            );
        });


    container.innerHTML = "";


    if (filtered.length === 0) {

        container.innerHTML =
            `<p>No questions found.</p>`;

        return;
    }


    filtered.forEach(q => {

        const card =
            document.createElement("div");

        card.className = "question-card";

        card.innerHTML = `

            <h3>${q.text}</h3>

            <p>
                A. ${q.options.A}
            </p>

            <p>
                B. ${q.options.B}
            </p>

            <p>
                C. ${q.options.C}
            </p>

            <p>
                D. ${q.options.D}
            </p>

            <div class="question-meta">

                <span class="badge">
                    ${q.subject}
                </span>

                <span class="badge">
                    ${q.difficulty}
                </span>

                <span class="badge">
                    Answer: ${q.correct}
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteQuestion(${q.id})">

                Delete

            </button>
        `;

        container.appendChild(card);
    });
}


// ========================================
// ADD QUESTION
// ========================================

document
    .getElementById("questionForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const newQuestion = {

                id: Date.now(),

                text:
                    document
                        .getElementById("questionText")
                        .value
                        .trim(),

                options: {

                    A:
                        document
                            .getElementById("optionA")
                            .value
                            .trim(),

                    B:
                        document
                            .getElementById("optionB")
                            .value
                            .trim(),

                    C:
                        document
                            .getElementById("optionC")
                            .value
                            .trim(),

                    D:
                        document
                            .getElementById("optionD")
                            .value
                            .trim()
                },

                correct:
                    document
                        .getElementById("correctAnswer")
                        .value,

                subject:
                    document
                        .getElementById("questionSubject")
                        .value
                        .trim(),

                difficulty:
                    document
                        .getElementById("questionDifficulty")
                        .value
            };


            questions.push(newQuestion);

            saveData();

            this.reset();

            updateAll();

        }
    );


// ========================================
// DELETE QUESTION
// ========================================

function deleteQuestion(id) {

    if (
        !confirm(
            "Delete this question?"
        )
    ) {
        return;
    }


    questions =
        questions.filter(
            q => q.id !== id
        );


    saveData();

    updateAll();
}


// ========================================
// SUBJECT FILTER
// ========================================

function populateSubjects() {

    const subjects =
        [...new Set(
            questions.map(
                q => q.subject
            )
        )];


    const filter =
        document.getElementById(
            "subjectFilter"
        );

    const examSubject =
        document.getElementById(
            "examSubject"
        );


    filter.innerHTML =
        `<option value="all">
            All Subjects
         </option>`;


    examSubject.innerHTML =
        `<option value="">
            Select Subject
         </option>`;


    subjects.forEach(subject => {

        filter.innerHTML += `
            <option value="${subject}">
                ${subject}
            </option>
        `;

        examSubject.innerHTML += `
            <option value="${subject}">
                ${subject}
            </option>
        `;
    });
}


// ========================================
// SEARCH EVENTS
// ========================================

document
    .getElementById("questionSearch")
    .addEventListener(
        "input",
        displayQuestionBank
    );


document
    .getElementById("subjectFilter")
    .addEventListener(
        "change",
        displayQuestionBank
    );


document
    .getElementById("difficultyFilter")
    .addEventListener(
        "change",
        displayQuestionBank
    );


// ========================================
// CREATE EXAM
// ========================================

document
    .getElementById("examForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("examName")
                    .value
                    .trim();

            const subject =
                document
                    .getElementById("examSubject")
                    .value;

            const count =
                Number(
                    document
                        .getElementById("examQuestionCount")
                        .value
                );

            const duration =
                Number(
                    document
                        .getElementById("examDuration")
                        .value
                );


            const available =
                questions.filter(
                    q => q.subject === subject
                );


            if (count > available.length) {

                alert(
                    `Only ${available.length} questions ` +
                    `are available for ${subject}.`
                );

                return;
            }


            const exam = {

                id: Date.now(),

                name,

                subject,

                questionCount: count,

                duration,

                questions: available.map(
                    q => q.id
                )
            };


            exams.push(exam);

            saveData();

            this.reset();

            displayExams();

            updateDashboard();
        }
    );


// ========================================
// DISPLAY EXAMS
// ========================================

function displayExams() {

    const container =
        document.getElementById("examList");

    container.innerHTML = "";


    if (exams.length === 0) {

        container.innerHTML =
            "<p>No exams created yet.</p>";

        return;
    }


    exams.forEach(exam => {

        const card =
            document.createElement("div");

        card.className =
            "exam-card";


        card.innerHTML = `

            <h3>${exam.name}</h3>

            <p>
                📚 Subject:
                <strong>${exam.subject}</strong>
            </p>

            <p>
                ❓ Questions:
                ${exam.questionCount}
            </p>

            <p>
                ⏱️ Duration:
                ${exam.duration} minutes
            </p>

            <button
                class="start-btn"
                onclick="startExam(${exam.id})">

                Start Exam

            </button>

            <button
                class="delete-btn"
                onclick="deleteExam(${exam.id})">

                Delete

            </button>
        `;

        container.appendChild(card);
    });
}


// ========================================
// DELETE EXAM
// ========================================

function deleteExam(id) {

    if (
        !confirm(
            "Delete this exam?"
        )
    ) {
        return;
    }


    exams =
        exams.filter(
            e => e.id !== id
        );


    saveData();

    displayExams();

    updateDashboard();
}


// ========================================
// RANDOMIZE QUESTIONS
// ========================================

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];
    }

    return copy;
}


// ========================================
// START EXAM
// ========================================

function startExam(id) {

    const exam =
        exams.find(
            e => e.id === id
        );


    if (!exam) return;


    const availableQuestions =
        questions.filter(
            q => exam.questions.includes(q.id)
        );


    activeExam = {

        ...exam,

        selectedQuestions:
            shuffle(
                availableQuestions
            ).slice(
                0,
                exam.questionCount
            )
    };


    document.getElementById(
        "examArea"
    ).style.display = "block";


    document.getElementById(
        "activeExamName"
    ).textContent = exam.name;


    window.scrollTo({
        top:
            document
                .getElementById("examArea")
                .offsetTop - 20,

        behavior: "smooth"
    });


    displayExamQuestions();

    startTimer(
        exam.duration * 60
    );
}


// ========================================
// DISPLAY EXAM QUESTIONS
// ========================================

function displayExamQuestions() {

    const container =
        document.getElementById(
            "examQuestions"
        );

    container.innerHTML = "";


    activeExam.selectedQuestions
        .forEach((q, index) => {

            const div =
                document.createElement("div");

            div.className =
                "exam-question";


            let optionsHTML = "";


            ["A", "B", "C", "D"]
                .forEach(letter => {

                    optionsHTML += `

                        <label class="option">

                            <input
                                type="radio"
                                name="question-${q.id}"
                                value="${letter}"
                            >

                            ${letter}.
                            ${q.options[letter]}

                        </label>
                    `;
                });


            div.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${q.text}
                </h3>

                ${optionsHTML}

            `;

            container.appendChild(div);
        });


    document.getElementById(
        "examProgress"
    ).textContent =
        `${activeExam.selectedQuestions.length}
         Questions`;
}


// ========================================
// TIMER
// ========================================

function startTimer(seconds) {

    clearInterval(timerInterval);

    remainingSeconds = seconds;

    updateTimer();


    timerInterval =
        setInterval(() => {

            remainingSeconds--;

            updateTimer();


            if (remainingSeconds <= 0) {

                clearInterval(timerInterval);

                alert(
                    "Time is over! The exam will be submitted."
                );

                submitExam();
            }

        }, 1000);
}


function updateTimer() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;


    document.getElementById(
        "timer"
    ).textContent =

        String(minutes).padStart(2, "0")
        + ":" +
        String(seconds).padStart(2, "0");
}


// ========================================
// SUBMIT EXAM
// ========================================

function submitExam() {

    if (!activeExam) return;


    clearInterval(timerInterval);


    let correct = 0;

    let answered = 0;


    activeExam.selectedQuestions
        .forEach(q => {

            const selected =
                document.querySelector(
                    `input[name="question-${q.id}"]:checked`
                );


            if (selected) {

                answered++;

                if (
                    selected.value ===
                    q.correct
                ) {
                    correct++;
                }
            }
        });


    const total =
        activeExam.selectedQuestions.length;


    const wrong =
        answered - correct;


    const unanswered =
        total - answered;


    const percentage =
        total === 0
            ? 0
            : (correct / total) * 100;


    const result = {

        id: Date.now(),

        examName:
            activeExam.name,

        subject:
            activeExam.subject,

        student:
            prompt(
                "Enter student name:"
            ) || "Anonymous",

        correct,

        wrong,

        unanswered,

        total,

        percentage:
            Number(
                percentage.toFixed(2)
            ),

        date:
            new Date().toLocaleString()
    };


    results.push(result);

    saveData();


    document.getElementById(
        "examArea"
    ).style.display = "none";


    activeExam = null;


    displayResults();

    updateDashboard();

    generateReport();


    alert(
        `Exam submitted!\n\n` +
        `Score: ${correct}/${total}\n` +
        `Percentage: ${percentage.toFixed(1)}%`
    );
}


// ========================================
// RESULTS & RANKING
// ========================================

function displayResults() {

    const container =
        document.getElementById(
            "results"
        );

    container.innerHTML = "";


    if (results.length === 0) {

        container.innerHTML =
            "<p>No exam attempts yet.</p>";

        return;
    }


    const sorted =
        [...results].sort(
            (a, b) =>
                b.percentage -
                a.percentage
        );


    sorted.forEach(
        (result, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "result-card";


            div.innerHTML = `

                <p class="rank">
                    🏆 Rank ${index + 1}
                </p>

                <h3>
                    ${result.student}
                </h3>

                <p>
                    Exam:
                    ${result.examName}
                </p>

                <p>
                    Score:
                    <span class="score">
                        ${result.correct}/${result.total}
                    </span>
                </p>

                <p>
                    Percentage:
                    <strong>
                        ${result.percentage}%
                    </strong>
                </p>

                <p>
                    Correct:
                    ${result.correct}
                    |
                    Wrong:
                    ${result.wrong}
                    |
                    Unanswered:
                    ${result.unanswered}
                </p>

                <small>
                    ${result.date}
                </small>
            `;

            container.appendChild(div);
        }
    );
}


// ========================================
// REPORT
// ========================================

function generateReport() {

    const report =
        document.getElementById(
            "report"
        );


    if (results.length === 0) {

        report.innerHTML =
            "<p>No data available.</p>";

        return;
    }


    let totalPercentage = 0;

    results.forEach(
        r =>
            totalPercentage +=
            r.percentage
    );


    const average =
        totalPercentage /
        results.length;


    const highest =
        Math.max(
            ...results.map(
                r => r.percentage
            )
        );


    const lowest =
        Math.min(
            ...results.map(
                r => r.percentage
            )
        );


    report.innerHTML = `

        <table class="report-table">

            <thead>

                <tr>

                    <th>Student</th>

                    <th>Exam</th>

                    <th>Score</th>

                    <th>Percentage</th>

                    <th>Date</th>

                </tr>

            </thead>

            <tbody>

                ${results.map(r => `

                    <tr>

                        <td>
                            ${r.student}
                        </td>

                        <td>
                            ${r.examName}
                        </td>

                        <td>
                            ${r.correct}/${r.total}
                        </td>

                        <td>
                            ${r.percentage}%
                        </td>

                        <td>
                            ${r.date}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

        <br>

        <p>
            <strong>
                Average Score:
            </strong>
            ${average.toFixed(2)}%
        </p>

        <p>
            <strong>
                Highest Score:
            </strong>
            ${highest}%
        </p>

        <p>
            <strong>
                Lowest Score:
            </strong>
            ${lowest}%
        </p>
    `;
}


// ========================================
// PRINT REPORT
// ========================================

function printReport() {

    const report =
        document.getElementById(
            "report"
        ).innerHTML;


    const windowPrint =
        window.open(
            "",
            "",
            "width=900,height=700"
        );


    windowPrint.document.write(`

        <html>

        <head>

            <title>Exam Report</title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                }

                th {
                    background: #4e73df;
                    color: white;
                }

            </style>

        </head>

        <body>

            <h1>Online Exam Report</h1>

            ${report}

        </body>

        </html>
    `);


    windowPrint.document.close();

    windowPrint.print();
}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    document.getElementById(
        "totalQuestions"
    ).textContent =
        questions.length;


    document.getElementById(
        "totalExams"
    ).textContent =
        exams.length;


    document.getElementById(
        "totalAttempts"
    ).textContent =
        results.length;


    if (results.length === 0) {

        document.getElementById(
            "averageScore"
        ).textContent =
            "0%";

        return;
    }


    const total =
        results.reduce(
            (sum, r) =>
                sum + r.percentage,
            0
        );


    document.getElementById(
        "averageScore"
    ).textContent =
        (total / results.length)
            .toFixed(1) + "%";
}


// ========================================
// UPDATE EVERYTHING
// ========================================

function updateAll() {

    populateSubjects();

    displayQuestionBank();

    displayExams();

    displayResults();

    generateReport();

    updateDashboard();
}


// ========================================
// INITIALIZE
// ========================================

updateAll();