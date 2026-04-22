import React, { useEffect, useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { folderApi } from "@/api";
import { getApiErrorMessage } from "@/api/helpers";
import { PageLoader } from "../../components/ui/Skeletons.jsx";

function getRequestedTemplatesFromResponse(payload) {
  if (Array.isArray(payload?.requestTemplates)) return payload.requestTemplates;
  if (Array.isArray(payload?.data?.requestTemplates))
    return payload.data.requestTemplates;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

function normalizeRequestedTemplate(template, index = 0) {
  return {
    id: template?._id || template?.id || `requested-template-${index}`,
    name: template?.name || `Requested Template ${index + 1}`,
  };
}

export default function RequestedTemplate() {
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateError, setTemplateError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchRequestedTemplates = async () => {
      setIsLoadingTemplates(true);
      setTemplateError("");

      try {
        const response = await folderApi.getRequestedTemplate();
        const nextTemplates = getRequestedTemplatesFromResponse(response).map(
          normalizeRequestedTemplate,
        );

        if (!isMounted) return;

        setTemplates(nextTemplates);
      } catch (error) {
        if (isMounted) {
          setTemplateError(
            getApiErrorMessage(error, "Failed to load requested templates."),
          );
          setTemplates([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTemplates(false);
        }
      }
    };

    fetchRequestedTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
            Requested Templates
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Requested template list
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Browse the templates returned by the request templates API in a
            clean read-only list.
          </p>
        </div>
      </div>

      {templateError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
          {templateError}
        </div>
      ) : null}

      {isLoadingTemplates ? (
        <PageLoader
          title="Loading Templates"
          message="Fetching requested templates from the API..."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                  <DocumentTextIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Template
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {template.name}
                  </h2>
                  <p className="mt-2 break-all text-xs text-slate-500">
                    ID: {template.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoadingTemplates && !templates.length ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="text-lg font-semibold text-slate-800">
            No requested templates found
          </div>
          <div className="mt-2 text-sm text-slate-500">
            The API did not return any request templates yet.
          </div>
        </div>
      ) : null}
    </div>
  );
}
