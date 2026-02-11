const isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      message: "Recruiter access only",
      success: false
    });
  }
  next();
};

export default isRecruiter;
