import healthRoutineModel from "../models/healthRoutine.model.js";

export const getWeekReportsAnalyticsController = async (req,res) => {
    try{
        const currentDate = new Date();
        const weekDate = currentDate - 7;

        const weekReports = await healthRoutineModel.find({
            date: {
                $gte: new Date(weekDate),
                $lte: currentDate
            }
        })

        if(weekReports.length === 0){
            return res.status(404).json({
                message: "No reports found for the past week"
            });
        }

        return res.status(200).json({
            message:"Reports fetched Successfully..",
            weekReports:weekReports
        })


    }catch(err){
        return res.status(500).json({
            message:"Internal server error",
            error: err.message
        });
    }
}


export const getMonthReportsAnalyticsController = async (req,res) => {
    try{
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); 
        const monthReports = await healthRoutineModel.find({
            date: {
                $gte: firstDayLastMonth,
                $lte: lastDayLastMonth
            }
        })

        if(monthReportsReports.length === 0){
            return res.status(404).json({
                message: "No reports found for the past month"
            });
        }

        return res.status(200).json({
            message:"Reports fetched Successfully..",
            monthReports:monthReports
        })


    }catch(err){
        return res.status(500).json({
            message:"Internal server error",
            error: err.message
        });
    }
}