import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, analyzeResume, getResumeAnalysisById } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const [ analysis, setAnalysis ] = useState(null)

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // --- ATS Resume Analysis Methods ---
    const runResumeAnalysis = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await analyzeResume({ jobDescription, selfDescription, resumeFile })
            setAnalysis(response.analysisData)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.analysisData
    }

    const getAnalysisById = async (analysisId) => {
        setLoading(true)
        let response = null
        try {
            response = await getResumeAnalysisById(analysisId)
            setAnalysis(response.analysisData)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.analysisData
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, analysis, generateReport, getReportById, getReports, getResumePdf, runResumeAnalysis, getAnalysisById }

}