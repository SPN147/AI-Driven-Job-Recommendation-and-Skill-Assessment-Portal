import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

/**
 * ================================
 * Student: Apply for job
 * ================================
 */
export const applyJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.id;

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      application,
    });
  } catch (error) {
    console.error("❌ applyJob error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/**
 * ================================
 * Student: Get applied jobs
 * ================================
 */
export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("❌ getAppliedJobs error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/**
 * ================================
 * Recruiter: Get applicants
 * ================================
 */
export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: "applications",
      populate: { path: "applicant" },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // 🔐 Recruiter ownership check
    if (job.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view applicants",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("❌ getApplicants error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

/**
 * ================================
 * Recruiter: Update application status
 * ================================
 */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    const job = await Job.findById(application.job);

    // 🔐 Recruiter ownership check
    if (job.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this application",
        success: false,
      });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("❌ updateStatus error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


/*import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const applyJob = async (req, res) => {
  try {
    const userId = req.user._id; // Make sure req.user._id is set by isAuthenticated middleware
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // ✅ Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // ✅ Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // ✅ Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // ✅ Push the application ID to job's applications array
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      application: newApplication, // optional: good for frontend confirmation
    });
  } catch (error) {
    console.error("❌ Error in applyJob:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};


// get list of their applied jobs for user.
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No Applications found",
        success: false,
      });
    }

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in getAppliedJobs:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message, 
    });
  }
};



// This is for admin to check how many people
//  have applied for that particular job using jobId.
export const getApplicants = async(req,res) =>{
   try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
      })

//  with 1st populate we get all access to entire application in application.model.js
// in 2nd populate we consider applicat field in entire application.
      if(!job)
      {
         return res.status(404).json({
            message:"Job not found",
            success:false
         })
      };
      return res.status(200).json({
        job,
        success:true
      })
   } catch (error) {
    console.error("❌ Error in getApplicants:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
   }
}

// If admin want to update the status of the application : 
// from pending to accepted or rejected etcc.
// we use : updateStatus function.
export const updateStatus = async(req,res) =>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
              return res.status(404).json({
            message:"Status is required",
            success:false
         })
        };
        // finding the application using applicant id
        const application = await Application.findOne({_id:applicationId})
        if(!application)
        {
           return res.status(404).json({
            message:"Application not found",
            success:false
           })
        };
        // update the status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        })
    } catch (error) {
        
    }
} */