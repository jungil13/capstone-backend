const db = require("./db"); // Ensure this is the correct path to your database connection or pool

class Report {
  static addReport(reportData, callback) {
    const {
      reporterID,
      reportType,
      description,
      location,
      contactInfo,
      photo,
      status,
    } = reportData;
    const query = `
            INSERT INTO lost_found_reports (ReporterID, ReportType, Description, Location, ContactInfo, Photo, Status)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
    db.query(
      query,
      [
        reporterID,
        reportType,
        description,
        location,
        contactInfo,
        photo,
        status,
      ],
      (err, results) => {
        callback(err, results);
      }
    );
  }

  static getAllReports(callback) {
    const query = `
            SELECT lost_found_reports.*, users.FullName AS reporterFullName 
            FROM lost_found_reports
            JOIN users ON lost_found_reports.ReporterID = users.UserID
        `;
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }
  static getReportDetails(reportId, callback) {
    const query = `
            SELECT lost_found_reports.*, users.FullName AS reporterFullName 
            FROM lost_found_reports
            JOIN users ON lost_found_reports.ReporterID = users.UserID
            WHERE lost_found_reports.ReportID = ?
        `;
    db.query(query, [reportId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }

  // Fetch reports by Reporter ID
  static getReportsByReporterId(ReporterID, callback) {
    const query = `
            SELECT * FROM lost_found_reports WHERE ReporterID = ?
        `;
    db.query(query, [ReporterID], callback);
  }

  // Update report status or other details
  static updateReport(ReportID, fields, callback) {
    let setClause = "SET ";
    const values = [];

    if (fields.ReportType) {
      setClause += "ReportType = ?, ";
      values.push(fields.ReportType);
    }
    if (fields.Description) {
      setClause += "Description = ?, ";
      values.push(fields.Description);
    }
    if (fields.Location) {
      setClause += "Location = ?, ";
      values.push(fields.Location);
    }
    if (fields.Status) {
      setClause += "Status = ?, ";
      values.push(fields.Status);
    }
    if (fields.Photo !== undefined) {
      setClause += "Photo = ?, ";
      values.push(fields.Photo);
    }

    setClause = setClause.slice(0, -2);

    const query = `
            UPDATE lost_found_reports
            ${setClause}
            WHERE ReportID = ? AND ReporterID = ?
        `;

    values.push(ReportID, fields.ReporterID);

    console.log("Update query:", query);
    console.log("Update values:", values);
    db.query(query, values, callback);
  }

  static getReportsById(reportId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT lost_found_reports.*, users.FullName AS reporterFullName
        FROM lost_found_reports
        JOIN users ON lost_found_reports.ReporterID = users.UserID
        WHERE lost_found_reports.ReportID = ?
      `;
      db.query(query, [reportId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });
  }
  

  static deleteReport(reportId, callback) {
    const query = "DELETE FROM lost_found_reports WHERE ReportID = ?";
    db.query(query, [reportId], callback);
  }

  static getReportCount = (callback) => {
    db.query('SELECT COUNT(*) AS count FROM lost_found_reports', (err, results) => {
      if (err) {
        console.error("Error fetching reports count:", err);
        callback(err, null);
      } else {
        callback(null, results[0].count);
      }
    });
  };

}


module.exports = Report;
