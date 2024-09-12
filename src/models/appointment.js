class Appointment {
  constructor(id, specialty, comments, date, student, professional) {
    this.id = id;
    this.specialty = specialty;
    this.comments = comments;
    this.date = date;
    this.student = student;
    this.professional = professional;
  }
}

module.exports = Appointment;
