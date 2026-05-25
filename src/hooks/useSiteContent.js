import { useEffect, useMemo, useState } from "react";
import { SERVICES, PROJECTS, TEAM } from "../data/index.js";
import { CASE_STUDIES } from "../data/caseStudies.js";
import { getCmsContent } from "../services/cms.js";
import { TESTIMONIALS, FAQS } from "../data/index.js";

const projectMedia = new Map(
  CASE_STUDIES.map((study) => [study.id, study])
);

const normalizeList = (items = []) =>
  [...items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

const withProjectFallbackMedia = (project) => {
  const slug = project.slug || project.id;
  const study = projectMedia.get(slug);

  return {
    ...project,
    id: slug,
    slug,
    image: project.image || study?.image || "",
    imageAlt: project.imageAlt || study?.imageAlt || project.title,
    summary: project.summary || project.desc,
    duration: project.duration || study?.duration || "",
    problem: project.problem || study?.problem || "",
    approach: project.approach || study?.approach || "",
    challenges: project.challenges || study?.challenges || "",
    goals: project.goals?.length ? project.goals : study?.goals || [],
    outcomes: project.outcomes?.length ? project.outcomes : study?.outcomes || [],
    stack: project.stack || project.tags || study?.stack || [],
  };
};

export const FALLBACK_CONTENT = {
  services: SERVICES.map((service, index) => ({ ...service, order: index, visible: true })),
  projects: PROJECTS.map((project, index) =>
    withProjectFallbackMedia({ ...project, slug: project.id, order: index, visible: true })
  ),
  team: TEAM.map((member, index) => ({ ...member, order: index, visible: true })),
  testimonials: TESTIMONIALS.map((t, index) => ({ ...t, order: index, visible: true })),
  faqs: FAQS.map((f, index) => ({ ...f, order: index, visible: true })),
};

export const normalizeContent = (data = {}) => {
  const services = normalizeList(data.services?.length ? data.services : FALLBACK_CONTENT.services);
  const projects = normalizeList(data.projects?.length ? data.projects : FALLBACK_CONTENT.projects)
    .map(withProjectFallbackMedia);
  const team = normalizeList(data.team?.length ? data.team : FALLBACK_CONTENT.team);
  const testimonials = normalizeList(data.testimonials?.length ? data.testimonials : FALLBACK_CONTENT.testimonials);
  const faqs = normalizeList(data.faqs?.length ? data.faqs : FALLBACK_CONTENT.faqs);

  return { services, projects, team, testimonials, faqs };
};

export function useSiteContent() {
  const [content, setContent] = useState(FALLBACK_CONTENT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    getCmsContent()
      .then((res) => {
        if (alive && res.success) setContent(normalizeContent(res.data));
      })
      .catch((err) => {
        if (alive) setError(err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return useMemo(
    () => ({ content, loading, error }),
    [content, loading, error]
  );
}
