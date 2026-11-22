
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchRecruiterJobsThunk } from "../../features/recruiter/recruiterThunks";
// import { askHiringAssistant } from "../../api/ai.api";

// import AIChatInterface from "../../components/AI/AIChatInterface";

// import {
//   loadAIChat,
//   saveSelectedAIJob,
//   saveAIConversation,
//   clearAIConversation,
// } from "../../utils/aiChatStorage";

// const CHAT_ROLE = "recruiter";

// const suggestions = [
//   "Summarize the applicants for this job.",
//   "Compare applicants based on their relevant skills.",
//   "What skills are most important for this position?",
//   "Identify applicants whose experience matches the job requirements.",
// ];

// const HiringAssistantPage = () => {
//   const dispatch = useDispatch();

//   const userId = useSelector((state) => state.auth.user?.id);

//   const {
//     jobsData,
//     isJobsLoading,
//     jobsError,
//   } = useSelector((state) => state.recruiter);

//   const jobs = jobsData?.jobs || [];

//   const [selectedJobId, setSelectedJobId] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Restore the previously selected job and its conversation.
//   useEffect(() => {
//     if (!userId) return;

//     const savedChat = loadAIChat(CHAT_ROLE, userId);
//     const savedJobId = savedChat.selectedJobId || "";

//     queueMicrotask(() => {
//       setSelectedJobId(savedJobId);
//       setMessages(
//         savedJobId
//           ? savedChat.conversations?.[savedJobId] || []
//           : []
//       );
//     });
//   }, [userId]);

//   // Fetch the recruiter's jobs.
//   useEffect(() => {
//     if (!userId) return;

//     dispatch(
//       fetchRecruiterJobsThunk({
//         page: 1,
//         limit: 50,
//         sort: "NEWEST",
//       })
//     );
//   }, [dispatch, userId]);

//   // Persist the conversation for the selected job.
//   useEffect(() => {
//     if (!userId || !selectedJobId) return;

//     saveAIConversation(
//       CHAT_ROLE,
//       userId,
//       selectedJobId,
//       messages
//     );
//   }, [messages, selectedJobId, userId]);

//   // Handle job selection.
//   const handleJobChange = (event) => {
//     const jobId = event.target.value;

//     setSelectedJobId(jobId);
//     setInput("");
//     setError(null);

//     saveSelectedAIJob(CHAT_ROLE, userId, jobId);

//     const savedChat = loadAIChat(CHAT_ROLE, userId);

//     setMessages(
//       jobId
//         ? savedChat.conversations?.[jobId] || []
//         : []
//     );
//   };

//   // Clear the conversation for the selected job.
//   const handleClearChat = () => {
//     if (!selectedJobId || isLoading) return;

//     clearAIConversation(
//       CHAT_ROLE,
//       userId,
//       selectedJobId
//     );

//     setMessages([]);
//     setInput("");
//     setError(null);
//   };

//   // Send a question to the AI Hiring Assistant.
//   const handleSend = async (question = input) => {
//     const trimmedQuestion = question.trim();

//     if (!selectedJobId || !trimmedQuestion || isLoading) {
//       return;
//     }

//     const previousMessages = messages;

//     const userMessage = {
//       id: `${Date.now()}-user`,
//       role: "user",
//       content: trimmedQuestion,
//     };

//     setMessages((previous) => [
//       ...previous,
//       userMessage,
//     ]);

//     setInput("");
//     setError(null);
//     setIsLoading(true);

//     try {
//       const history = previousMessages
//         .slice(-10)
//         .map(({ role, content }) => ({
//           role,
//           content,
//         }));

//       const response = await askHiringAssistant({
//         jobId: selectedJobId,
//         question: trimmedQuestion,
//         history,
//       });

//       const assistantMessage = {
//         id: `${Date.now()}-assistant`,
//         role: "assistant",
//         content: response.data.answer,
//       };

//       setMessages((previous) => [
//         ...previous,
//         assistantMessage,
//       ]);
//     } catch (err) {
//       setMessages(previousMessages);
//       setInput(trimmedQuestion);

//       setError(
//         err.response?.data?.message ||
//           "Unable to generate a response. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const selectedJob = jobs.find(
//     (job) => job._id === selectedJobId
//   );

//   return (
//     <div className="container-fluid py-4">
//       <div
//         className="mx-auto"
//         style={{ maxWidth: "1200px" }}
//       >
//         {/* Page Header */}
//         <div className="mb-4">
//           <div className="d-flex align-items-center gap-2 mb-2">
//             <i className="bi bi-robot fs-3 text-primary"></i>

//             <h2 className="fw-bold mb-0">
//               AI Hiring Assistant
//             </h2>
//           </div>

//           <p className="text-secondary mb-0">
//             Get AI-powered insights about your applicants,
//             understand candidate profiles, and make more
//             informed hiring decisions.
//           </p>
//         </div>

//         {/* Job Selection */}
//         <div className="card border-0 shadow-sm mb-4">
//           <div className="card-body p-3 p-md-4">
//             <label
//               htmlFor="hiringAssistantJob"
//               className="form-label fw-semibold"
//             >
//               Select a Job
//             </label>

//             {isJobsLoading ? (
//               <div className="d-flex align-items-center gap-2 text-secondary">
//                 <span
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                 ></span>

//                 Loading your jobs...
//               </div>
//             ) : jobsError ? (
//               <div className="alert alert-danger mb-0">
//                 {jobsError}
//               </div>
//             ) : jobs.length === 0 ? (
//               <div className="alert alert-info mb-0">
//                 You haven't posted any jobs yet. Create a job
//                 to start using the AI Hiring Assistant.
//               </div>
//             ) : (
//               <select
//                 id="hiringAssistantJob"
//                 className="form-select"
//                 value={selectedJobId}
//                 onChange={handleJobChange}
//                 disabled={isLoading}
//               >
//                 <option value="">
//                   Choose a job to get started
//                 </option>

//                 {jobs.map((job) => (
//                   <option
//                     key={job._id}
//                     value={job._id}
//                   >
//                     {job.title} ({job.status})
//                   </option>
//                 ))}
//               </select>
//             )}

//             {/* Selected Job Information */}
//             {selectedJob && (
//               <div className="border rounded p-3 mt-3 bg-light">
//                 <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
//                   <div>
//                     <h6 className="fw-bold mb-2">
//                       {selectedJob.title}
//                     </h6>

//                     <div className="d-flex flex-wrap gap-3 text-secondary small">
//                       {selectedJob.location && (
//                         <span>
//                           <i className="bi bi-geo-alt me-1"></i>
//                           {selectedJob.location}
//                         </span>
//                       )}

//                       {selectedJob.employmentType && (
//                         <span>
//                           <i className="bi bi-briefcase me-1"></i>
//                           {selectedJob.employmentType}
//                         </span>
//                       )}

//                       {selectedJob.workMode && (
//                         <span>
//                           <i className="bi bi-laptop me-1"></i>
//                           {selectedJob.workMode}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <span
//                     className={`badge ${
//                       selectedJob.status === "ACTIVE"
//                         ? "bg-success"
//                         : "bg-secondary"
//                     }`}
//                   >
//                     {selectedJob.status}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* AI Chat */}
//         <AIChatInterface
//           assistantName="AI Hiring Assistant"
//           description="Ask questions about applicants and your selected job."
//           messages={messages}
//           input={input}
//           onInputChange={setInput}
//           onSend={handleSend}
//           onClear={handleClearChat}
//           isLoading={isLoading}
//           error={error}
//           suggestions={suggestions}
//           onSuggestionClick={handleSend}
//           disabled={!selectedJobId || isJobsLoading || jobs.length === 0}
//           disabledMessage="Select one of your jobs above to start chatting with the AI Hiring Assistant."
//         />

//         {/* AI Disclaimer */}
//         <p className="text-secondary small mt-3 mb-0">
//           <i className="bi bi-info-circle me-1"></i>
//           AI responses are based on available job and applicant
//           information. Always review candidate information and
//           make your own hiring decisions.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default HiringAssistantPage;
// ------------------------------------------------------------------------------------------------------



import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchRecruiterJobsThunk } from "../../features/recruiter/recruiterThunks";
import { askHiringAssistant } from "../../api/ai.api";

import AIChatInterface from "../../components/AI/AIChatInterface";

import {
  loadAIChat,
  saveSelectedAIJob,
  saveAIConversation,
  clearAIConversation,
} from "../../utils/aiChatStorage";

const CHAT_ROLE = "recruiter";

const suggestions = [
  "Summarize the applicants for this job.",
  "Compare applicants based on their relevant skills.",
  "What skills are most important for this position?",
  "Identify applicants whose experience matches the job requirements.",
];

const HiringAssistantPage = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user?.id);

  const {
    jobsData,
    isJobsLoading,
    jobsError,
  } = useSelector((state) => state.recruiter);

  const jobs = jobsData?.jobs || [];

  const [selectedJobId, setSelectedJobId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Job search and dropdown states.
  const [jobSearch, setJobSearch] = useState("");
  const [debouncedJobSearch, setDebouncedJobSearch] = useState("");
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);

  const jobDropdownRef = useRef(null);

  // Restore the previously selected job and its conversation.
  useEffect(() => {
    if (!userId) return;

    const savedChat = loadAIChat(CHAT_ROLE, userId);
    const savedJobId = savedChat.selectedJobId || "";

    queueMicrotask(() => {
      setSelectedJobId(savedJobId);
      setMessages(
        savedJobId
          ? savedChat.conversations?.[savedJobId] || []
          : []
      );
    });
  }, [userId]);

  // Debounce job search by 500ms.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedJobSearch(jobSearch.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [jobSearch]);

  // Fetch recruiter jobs whenever the debounced search changes.
  // useEffect(() => {
  //   if (!userId) return;

  //   dispatch(
  //     fetchRecruiterJobsThunk({
  //       ...(debouncedJobSearch && {
  //         search: debouncedJobSearch,
  //       }),
  //       page: 1,
  //       limit: 50,
  //       sort: "NEWEST",
  //     })
  //   );
  // }, [dispatch, debouncedJobSearch, userId]);
useEffect(() => {
  if (!userId) return;

  dispatch(
    fetchRecruiterJobsThunk({
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
}, [dispatch, userId]);
useEffect(() => {
  if (!userId || !debouncedJobSearch) return;

  dispatch(
    fetchRecruiterJobsThunk({
      search: debouncedJobSearch,
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
}, [dispatch, debouncedJobSearch, userId]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        jobDropdownRef.current &&
        !jobDropdownRef.current.contains(event.target)
      ) {
        setIsJobDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // Persist the conversation for the selected job.
  useEffect(() => {
    if (!userId || !selectedJobId) return;

    saveAIConversation(
      CHAT_ROLE,
      userId,
      selectedJobId,
      messages
    );
  }, [messages, selectedJobId, userId]);

  // Handle job selection.
  const handleJobChange = (jobId) => {
    setSelectedJobId(jobId);
    setInput("");
    setError(null);
    setIsJobDropdownOpen(false);
    setJobSearch("");

    saveSelectedAIJob(CHAT_ROLE, userId, jobId);

    const savedChat = loadAIChat(CHAT_ROLE, userId);

    setMessages(
      jobId
        ? savedChat.conversations?.[jobId] || []
        : []
    );
  };

  // Clear the job search.
  // const handleClearSearch = () => {
  //   setJobSearch("");
  //   setDebouncedJobSearch("");
  //   setIsJobDropdownOpen(true);
  // };
  const handleClearSearch = () => {
  setJobSearch("");
  setDebouncedJobSearch("");
  setIsJobDropdownOpen(true);

  dispatch(
    fetchRecruiterJobsThunk({
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
};

  // Clear the conversation for the selected job.
  const handleClearChat = () => {
    if (!selectedJobId || isLoading) return;

    clearAIConversation(
      CHAT_ROLE,
      userId,
      selectedJobId
    );

    setMessages([]);
    setInput("");
    setError(null);
  };

  // Send a question to the AI Hiring Assistant.
  const handleSend = async (question = input) => {
    const trimmedQuestion = question.trim();

    if (!selectedJobId || !trimmedQuestion || isLoading) {
      return;
    }

    const previousMessages = messages;

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const history = previousMessages
        .slice(-10)
        .map(({ role, content }) => ({
          role,
          content,
        }));

      const response = await askHiringAssistant({
        jobId: selectedJobId,
        question: trimmedQuestion,
        history,
      });

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: response.data.answer,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      setMessages(previousMessages);
      setInput(trimmedQuestion);

      setError(
        err.response?.data?.message ||
          "Unable to generate a response. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedJob = jobs.find(
    (job) => job._id === selectedJobId
  );

  return (
    <div className="container-fluid py-4">
      <div
        className="mx-auto"
        style={{ maxWidth: "1200px" }}
      >
        {/* Page Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <i className="bi bi-robot fs-3 text-primary"></i>

            <h2 className="fw-bold mb-0">
              AI Hiring Assistant
            </h2>
          </div>

          <p className="text-secondary mb-0">
            Get AI-powered insights about your applicants,
            understand candidate profiles, and make more
            informed hiring decisions.
          </p>
        </div>

        {/* Job Selection */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <label
              htmlFor="hiringAssistantJob"
              className="form-label fw-semibold"
            >
              Select a Job
            </label>

            {jobsError && jobs.length === 0 ? (
              <div className="alert alert-danger mb-0">
                {jobsError}
              </div>
            ) : jobs.length === 0 &&
              !isJobsLoading &&
              !debouncedJobSearch ? (
              <div className="alert alert-info mb-0">
                You haven't posted any jobs yet. Create a job
                to start using the AI Hiring Assistant.
              </div>
            ) : (
              <div
                className="position-relative"
                ref={jobDropdownRef}
              >
                {/* Search Input */}
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-secondary"></i>
                  </span>

                  <input
                    id="hiringAssistantJob"
                    type="text"
                    className="form-control"
                    placeholder="Search jobs by title, skills, or location..."
                    value={jobSearch}
                    onChange={(event) => {
                      setJobSearch(event.target.value);
                      setIsJobDropdownOpen(true);
                    }}
                    onFocus={() => setIsJobDropdownOpen(true)}
                    disabled={isLoading}
                    autoComplete="off"
                  />

                  {jobSearch && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleClearSearch}
                      disabled={isLoading}
                      aria-label="Clear job search"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>

                {/* Selected Job */}
                {!isJobDropdownOpen && selectedJob && (
                  <div className="form-text mt-2">
                    Selected: <strong>{selectedJob.title}</strong>
                  </div>
                )}

                {/* Search Results Dropdown */}
               
{/* Search Results Dropdown */}
{isJobDropdownOpen && (
  <div
    className="position-absolute top-100 start-0 w-100 bg-white border rounded shadow mt-1"
    style={{
      zIndex: 1050,
      maxHeight: "320px",
      overflowY: "auto",
    }}
  >
    {isJobsLoading ? (
      <div className="p-3 text-center text-muted">
        <span className="spinner-border spinner-border-sm text-primary me-2"></span>
        Searching jobs...
      </div>
    ) : jobsError ? (
      <div className="p-3 text-danger small">
        {jobsError}
      </div>
    ) : jobs.length === 0 ? (
      <div className="p-3 text-center text-muted small">
        No matching jobs found.
      </div>
    ) : (
      jobs.map((job) => (
        <button
          key={job._id}
          type="button"
          className={`dropdown-item p-3 border-bottom ${
            selectedJobId === job._id ? "active" : ""
          }`}
          onClick={() => {
            handleJobChange(job._id);
            setJobSearch(job.title);
          }}
        >
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div>
              <div className="fw-semibold">
                {job.title}
              </div>

              <small
                className={
                  selectedJobId === job._id
                    ? "text-white-50"
                    : "text-muted"
                }
              >
                <i className="bi bi-geo-alt me-1"></i>
                {job.location || "Location not specified"}
              </small>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge ${
                  job.status === "ACTIVE"
                    ? "bg-success"
                    : "bg-secondary"
                }`}
              >
                {job.status}
              </span>

              {selectedJobId === job._id && (
                <i className="bi bi-check-circle-fill"></i>
              )}
            </div>
          </div>
        </button>
      ))
    )}
  </div>
)}

              </div>
            )}

            {/* Selected Job Information */}
            {selectedJob && (
              <div className="border rounded p-3 mt-3 bg-light">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                  <div>
                    <h6 className="fw-bold mb-2">
                      {selectedJob.title}
                    </h6>

                    <div className="d-flex flex-wrap gap-3 text-secondary small">
                      {selectedJob.location && (
                        <span>
                          <i className="bi bi-geo-alt me-1"></i>
                          {selectedJob.location}
                        </span>
                      )}

                      {selectedJob.employmentType && (
                        <span>
                          <i className="bi bi-briefcase me-1"></i>
                          {selectedJob.employmentType}
                        </span>
                      )}

                      {selectedJob.workMode && (
                        <span>
                          <i className="bi bi-laptop me-1"></i>
                          {selectedJob.workMode}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      selectedJob.status === "ACTIVE"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat */}
        <AIChatInterface
          assistantName="AI Hiring Assistant"
          description="Ask questions about applicants and your selected job."
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          onClear={handleClearChat}
          isLoading={isLoading}
          error={error}
          suggestions={suggestions}
          onSuggestionClick={handleSend}
          disabled={!selectedJobId || isJobsLoading || jobs.length === 0}
          disabledMessage="Select one of your jobs above to start chatting with the AI Hiring Assistant."
        />

        {/* AI Disclaimer */}
        <p className="text-secondary small mt-3 mb-0">
          <i className="bi bi-info-circle me-1"></i>
          AI responses are based on available job and applicant
          information. Always review candidate information and
          make your own hiring decisions.
        </p>
      </div>
    </div>
  );
};

export default HiringAssistantPage;
