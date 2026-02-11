import { response } from "express";
import { Company } from "../models/company.model.js";

//   GPT-CORRECT one.
export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, logo } = req.body;

    if (!companyName || !description || !website || !location) {
      return res.status(400).json({
        message: "All fields (companyName, description, website, location) are required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You cannot register the same company twice.",
        success: false,
      });
    }

  company = await Company.create({
  name: companyName,
  description,
  website,
  location,
  logo: logo || "",
  recruiter: req.user._id, // ✅ FIXED
});

    return res.status(201).json({
      message: "Company registered successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("🔥 RegisterCompany error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};


// export const registerCompany = async(req,res) => {
//    try {
//     console.log("➡️ Reached registerCompany");
//     console.log("req.id =", req.id);
//     console.log("req.body =", req.body);
//     // accepting company details from user.
//      const {companyName}  = req.body;
//      if(!companyName)
//      {
//         return res.status(400).json({
//             message:"Company name is required.",
//             success:false,
//         })
//      }
//      // If any of the company entered is already found in db.
//      let company = await Company.findOne({name:companyName});
//      console.log("Existing company:", company);

//      if(company)
//      {
//         return res.status(400).json({
//             message:"You cannot register same company.",
//             success:false
//         })
//      };
//      // create the company if not matched.
//      company = await Company.create({
//         name:companyName,
//         // userId is used to find out who is creating it.
//         userId:req.id
//      });

//      console.log("✅ Company created:", company);
//      return res.status(201).json({
//         message:"Company registred successfully",
//         // return the company once created.
//         company,
//         success:true
//      })
//    } catch (error) {
//     //   console.log(error);
//     console.error("RegisterCompany error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//       success: false,
//     });
//    }
// }



// Get company
export const getCompany = async(req,res)=>{
    try {
// getting all the companies list created by the user who have created it using userId
        const userId = req.user.id; // It is logged in userId, and we get companies of his.
        const companies = await Company.find({userId});
        // If any company is not found on recruiter name
        if(!companies)
        {
            return res.status(404).json({
                message:"Companies not found.",
                success:false
            })
        }
        return res.status(200).json({
          companies,
          success:true
        })
    } catch (error) {
        console.log(error);
    }
}


// get company by id
export const getCompanyById = async(req,res)=>{
    try {
// We use req.params.id when the route is of form:
// ex: router.route("/company/:id").get(companyName)
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company)
        {
           return res.status(404).json({
                message:"Company not found.",
                success:false
            }) 
        }
        // If found return the company
        return res.status(200).json({
            company,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCompany = async(req,res)=>{
    try {
        const {name,description,website,location} = req.body;
        const file = req.file;
        
        const updateData = {name,description,website,location};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true});

        if(!company)
        {
             return res.status(404).json({
                message:"Company not found.",
                success:false
             })
        }

        return res.status(200).json({
            message:"Company information updated",
            success:true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
      message: "Server error while updating company",
      error: error.message,
      success: false,
    });
    }
}