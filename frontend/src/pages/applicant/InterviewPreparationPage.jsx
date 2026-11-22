 

 import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchJobsThunk } from "../../features/jobs/jobsThunks";
import { askInterviewPreparation } from "../../api/ai.api";

import AIChatInterface from "../../components/AI/AIChatInterface";

import {
  loadAIChat,
  saveSelectedAIJob,
  saveAIConversation,
  clearAIConversation,
} from "../../utils/aiChatStorage";

const suggestions = [
  "Generate technical interview questions for this job.",
  "What skills should I focus on before the interview?",
  "Give me common HR interview questions with sample answers.",
  "Identify gaps between my profile and the job requirements.",
];

const CHAT_ROLE = "applicant";

const InterviewPreparationPage = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.auth.user?.id);

  const {
    searchResults,
    isSearchLoading,
    searchError,
  } = useSelector((state) => state.jobs);

  const [selectedJobId, setSelectedJobId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

 
// Debounce the job search input.
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setDebouncedJobSearch(jobSearch.trim());
  }, 500);

  return () => clearTimeout(timeoutId);
}, [jobSearch]);

// Fetch jobs using the debounced search value.
// useEffect(() => {
//   if (!userId) return;

//   dispatch(
//     fetchJobsThunk({
//       ...(debouncedJobSearch && {
//         search: debouncedJobSearch,
//       }),
//       page: 1,
//       limit: 50,
//       sort: "NEWEST",
//     })
//   );
// }, [dispatch, debouncedJobSearch, userId]);
// Fetch active jobs immediately when the applicant opens the page.
useEffect(() => {
  if (!userId) return;

  dispatch(
    fetchJobsThunk({
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
}, [dispatch, userId]);

// Fetch filtered jobs only after the debounced search value changes.
useEffect(() => {
  if (!userId || !debouncedJobSearch) return;

  dispatch(
    fetchJobsThunk({
      search: debouncedJobSearch,
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
}, [dispatch, debouncedJobSearch, userId]);

  // Automatically persist the current conversation.
  useEffect(() => {
    if (!userId || !selectedJobId) return;

    saveAIConversation(
      CHAT_ROLE,
      userId,
      selectedJobId,
      messages
    );
  }, [messages, selectedJobId, userId]);


  // Close the job dropdown when clicking outside.
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
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);
  // Select a job and restore its saved conversation.
 
// const handleJobChange = (jobId) => {
//   setSelectedJobId(jobId);
//   setInput("");
//   setError(null);
//   setIsJobDropdownOpen(false);

//   saveSelectedAIJob(CHAT_ROLE, userId, jobId);

//   const savedChat = loadAIChat(CHAT_ROLE, userId);

//   setMessages(
//     jobId
//       ? savedChat.conversations?.[jobId] || []
//       : []
//   );
// };

const handleJobChange = (jobId) => {
  setSelectedJobId(jobId);
  setInput("");
  setError(null);
  setIsJobDropdownOpen(false);

  // Reset the search without triggering an unnecessary API request.
  setJobSearch("");
  setDebouncedJobSearch("");

  saveSelectedAIJob(CHAT_ROLE, userId, jobId);

  const savedChat = loadAIChat(CHAT_ROLE, userId);

  setMessages(
    jobId
      ? savedChat.conversations?.[jobId] || []
      : []
  );
};
const handleClearSearch = () => {
  setJobSearch("");
  setDebouncedJobSearch("");
  setIsJobDropdownOpen(true);

  if (!userId) return;

  dispatch(
    fetchJobsThunk({
      page: 1,
      limit: 50,
      sort: "NEWEST",
    })
  );
};

  // Clear only the selected job's conversation.
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

  // Send a question to the AI assistant.
  const handleSend = async (question = input) => {
    const trimmedQuestion = question.trim();

    if (
      !selectedJobId ||
      !trimmedQuestion ||
      isLoading
    ) {
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

      const response = await askInterviewPreparation({
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

  const selectedJob = searchResults.find(
    (job) => job._id === selectedJobId
  );

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-2">
          <i className="bi bi-robot text-primary me-2"></i>
          AI Interview Preparation
        </h3>

        <p className="text-muted mb-0">
          Prepare for interviews with personalized AI guidance
          based on your profile and selected job.
        </p>
      </div>

     

      {/* Job Selection */}
<div className="card shadow-sm mb-4">
  <div className="card-body">
    <label
      htmlFor="interviewJobSearch"
      className="form-label fw-semibold"
    >
      Select a job for interview preparation
    </label>

    <div
      className="position-relative"
      ref={jobDropdownRef}
    >
      {/* Search Input */}
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search text-muted"></i>
        </span>

        <input
          id="interviewJobSearch"
          type="search"
          className="form-control"
          placeholder="Search jobs by title, skills or location..."
          value={jobSearch}
          onFocus={() => setIsJobDropdownOpen(true)}
          onChange={(event) => {
            setJobSearch(event.target.value);
            setIsJobDropdownOpen(true);
          }}
        />

        {jobSearch && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            // onClick={() => {
            //   setJobSearch("");
            //   setIsJobDropdownOpen(true);
            // }}
            onClick={handleClearSearch}
            title="Clear search"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

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
          {isSearchLoading ? (
            <div className="p-3 text-center text-muted">
              <span className="spinner-border spinner-border-sm text-primary me-2"></span>
              Searching jobs...
            </div>
          ) : searchError ? (
            <div className="p-3 text-danger small">
              {searchError}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-3 text-center text-muted small">
              No matching active jobs found.
            </div>
          ) : (
            searchResults.map((job) => (
              <button
                key={job._id}
                type="button"
                className={`dropdown-item p-3 border-bottom ${
                  selectedJobId === job._id ? "active" : ""
                }`}
                // onClick={() => {
                //   handleJobChange(job._id);
                //   setJobSearch(job.title);
                // }}
                onClick={() => handleJobChange(job._id)}
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
                      {job.location}
                    </small>
                  </div>

                  {selectedJobId === job._id && (
                    <i className="bi bi-check-circle-fill"></i>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>

    {/* Selected Job Details */}
    {selectedJob && (
      <div className="mt-3 p-3 bg-light rounded">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <h6 className="mb-2">{selectedJob.title}</h6>

          <span className="badge bg-success">
            Selected
          </span>
        </div>

        <div className="d-flex flex-wrap gap-3 text-muted small">
          <span>
            <i className="bi bi-geo-alt me-1"></i>
            {selectedJob.location}
          </span>

          <span>
            <i className="bi bi-briefcase me-1"></i>
            {selectedJob.employmentType?.replaceAll("_", " ")}
          </span>

          <span>
            <i className="bi bi-laptop me-1"></i>
            {selectedJob.workMode}
          </span>
        </div>
      </div>
    )}
  </div>
</div>
       
      {/* AI Chat */}
<div
  className="w-100 me-auto"
  style={{
    maxWidth: "1200px",
    width: "100%",
    marginRight: "auto",
  }}
>
  <AIChatInterface
    assistantName="AI Interview Assistant"
    description="Your personalized interview preparation partner"
    messages={messages}
    input={input}
    onInputChange={setInput}
    onSend={() => handleSend()}
    onClear={handleClearChat}
    isLoading={isLoading}
    error={error}
    suggestions={suggestions}
    onSuggestionClick={handleSend}
    disabled={!selectedJobId}
    disabledMessage="Choose an active job above to start personalized interview preparation."
  />
</div>
    </div>
  );
};

export default InterviewPreparationPage;
