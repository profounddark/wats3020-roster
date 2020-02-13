/* JS for WATS 3020 Roster Project */

class Person
{
    constructor(personName, personEmail)
    {
        this.name = personName;
        this.email = personEmail;
        this.username = personEmail.split('@', 1)[0];
        this.ID = Date.now();
    }
}

class Student extends Person
{
    constructor(studentName, studentEmail)
    {
        super(studentName, studentEmail);
        this.attendance = [];
        console.log(this);
    }

    calculateAttendance()
    //returns a string percentage of attendance, to two decimal places
    {
        let attendanceDays = 0;
        for (let count = 0; count < this.attendance.length; count++)
        {
            attendanceDays += this.attendance[count];
        }
        // I did not like that students would have their attendance listed as NaN
        // This if-then statement just corrects that.
        if (this.attendance.length == 0)
        {
            return '0.00%';
        }
        else
        {
            return (100 * attendanceDays / this.attendance.length).toFixed(2) + "%";
        }
        
    }
}

class Teacher extends Person
{
    constructor(teacherName, teacherEmail, teacherHonorific)
    {
        super(teacherName, teacherEmail);
        this.honorific = teacherHonorific;
    }
}


// TODO: Set up our Course class so we can run the whole roster from it.
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    addStudent()
    {
        let newStudentName = prompt('Please enter the new student name:', 'Jane Student');
        let newStudentEmail = prompt('Please enter the new student email address:', 'jstudent@college.edu');
        this.students.push(new Student(newStudentName, newStudentEmail));
        updateRoster(this);
    }

    removeStudent(ID)
    {
        let outStudent = this.findStudent(ID);
        let outIndex = this.students.indexOf(outStudent);
        this.students.splice(outIndex, 1);
    }

    setTeacher()
    {
        let newTeacherName = prompt('Please enter the name of the teacher:', 'Tammy Teacher');
        let newTeacherEmail = prompt('Please enter the email address of the teacher:', 'tteacher@college.edu');
        let newTeacherHonorific = prompt('Please enter the honorific for the teacher:', 'Professor');
        this.teacher = new Teacher(newTeacherName, newTeacherEmail, newTeacherHonorific);
        //not specified in the TODO but it seemed relevant
        updateRoster(this);
    }

    removeTeacher()
    {
        this.teacher = null;
        updateRoster(this);
    }

    markAttendance(ID, status = 'present')
    // I actually found the TODO for this method to be unclear.
    // In the code, markAttendance gets called one of two ways:
    // It either has one parameter (the username), signifying the student is present
    // Or it is called with two params, with the second one being the string 'absent'
    // Honestly, that's bizarre to me. But, either way, the method works.
    {
        let markedStudent = this.findStudent(ID);
        if (status == 'present')
        {
            markedStudent.attendance.push(1);
        }
        else if (status == 'absent')
        {
            markedStudent.attendance.push(0);
        }

    }

    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(ID){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.ID == ID;
        });
        console.log(foundStudent);
        return foundStudent;
    }
}

// Prompt user for Course information (code, title, description)
let myCourseCode = prompt('Please enter the course code for this course:', 'WATS 3020');
let myCourseTitle = prompt('Please enter the title for thise course:', 'Introduction to JavaScript');
let myCourseDescription = prompt('Please enter the description of this course:', 'An introductory course in JavaScript programming.');

let myCourse = new Course(myCourseCode, myCourseTitle, myCourseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Added an event listener for removing a teacher.
let removeTeacherButton = document.querySelector('#remove-teacher');
removeTeacherButton.addEventListener('click', function(e){
    console.log('Calling removeTeacher() method.');
    myCourse.removeTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-ID', student.ID);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-ID', student.ID);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        let removeButton = document.createElement('button');
        removeButton.innerHTML = "Remove";
        removeButton.setAttribute('data-ID', student.ID);
        removeButton.setAttribute('class', 'remove');
        actionsTD.appendChild(removeButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(e.target.dataset);
            console.log(`Marking ${e.target.dataset.id} present.`);
            myCourse.markAttendance(e.target.dataset.id);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.id} absent.`);
            myCourse.markAttendance(e.target.dataset.id, 'absent');
            updateRoster(myCourse);
        });
    }
    let removeButtons = document.querySelectorAll('.remove');
    for (button of removeButtons){
        button.addEventListener('click', function(e){
            console.log(`Removing ${e.target.dataset.id}.`);
            myCourse.removeStudent(e.target.dataset.id);
            updateRoster(myCourse);
        });
    }
}

