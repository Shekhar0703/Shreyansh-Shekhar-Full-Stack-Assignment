import { useMemo, useState } from "react";
import { supportedLanguages } from "@challenge/contracts";
import { promptSchema } from "../lib/validation";

const initialValues = {
  prompt: "",
  targetLanguage: "en",
  contextId: "",
};

export function PromptForm({ onSubmit, isSubmitting }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const validation = useMemo(() => promptSchema.safeParse(values), [values]);
  const isValid = validation.success;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsed = promptSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] ?? "prompt";
        nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({
      prompt: parsed.data.prompt.trim(),
      targetLanguage: parsed.data.targetLanguage,
      contextId: parsed.data.contextId || undefined,
    });
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
      <div className="panel-heading">
        <span className="eyebrow">Submission</span>
        <h2>Send a prompt to the middleware</h2>
      </div>

      <label className="field">
        <span>Prompt</span>
        <textarea
          name="prompt"
          rows="6"
          value={values.prompt}
          onChange={handleChange}
          placeholder="Describe what you need the AI service to analyze"
        />
        {errors.prompt ? <strong className="field-error">{errors.prompt}</strong> : null}
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Target Language</span>
          <select name="targetLanguage" value={values.targetLanguage} onChange={handleChange}>
            {supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {language.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.targetLanguage ? <strong className="field-error">{errors.targetLanguage}</strong> : null}
        </label>

        <label className="field">
          <span>Context ID</span>
          <input
            name="contextId"
            value={values.contextId}
            onChange={handleChange}
            placeholder="Optional UUID"
            inputMode="text"
          />
          {errors.contextId ? <strong className="field-error">{errors.contextId}</strong> : null}
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit prompt"}
      </button>
    </form>
  );
}
