import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import "./Work.css";

const highlightedTech = new Set([
  "react",
  "next.js",
  "nextjs",
  "python",
  "py",
  "node.js",
  "nodejs",
  "ai/ml",
  "ai",
  "ml",
  "mongodb",
  "tailwind",
]);

const toYouTubeEmbed = (url) => {
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
  if (!match) return null;
  const id = match[1];
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&modestbranding=1`;
};

const toVimeoEmbed = (url) => {
  const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&background=1`;
};

function ProjectMedia({ project }) {
  const videoUrl = project.videoUrl || project.video;
  const embedUrl = videoUrl && (toYouTubeEmbed(videoUrl) || toVimeoEmbed(videoUrl));
  const isDirectVideo = videoUrl && !embedUrl;

  if (embedUrl) {
    return (
      <iframe
        className="work-card-embed"
        src={embedUrl}
        title={`${project.title} demo video`}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    );
  }

  if (isDirectVideo) {
    return (
      <video
        className="work-card-video"
        src={videoUrl}
        poster={project.image || undefined}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.imageAlt || project.title}
        loading="lazy"
      />
    );
  }

  return <div className="work-card-fallback">{project.title?.slice(0, 2) || "KA"}</div>;
}

export default function Work({ projects = [], loading = false }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const openProject = (project) => {
    const slug = project.slug || project.id || project._id;
    if (slug) navigate(`/work/${slug}`);
  };

  return (
    <div className={loading ? "work-bg is-loading" : "work-bg"}>
      <div className="work-inner" id="work">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Case Studies</div>
              <h2 className="sec-title">Selected <em>Work</em></h2>
            </div>
          </div>
          <p className="work-subtitle">
            Selected Internal Builds &amp; Product Concepts
          </p>
        </Reveal>

        <div className="work-card-grid">
          {projects.map((project, index) => (
            <motion.article
              className="work-card"
              key={project._id || project.slug || project.id || project.title}
              style={{ "--proj-color": project.color || "var(--accent)" }}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.58, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -10 }}
              role="button"
              tabIndex={0}
              onClick={() => openProject(project)}
              onKeyDown={(event) => event.key === "Enter" && openProject(project)}
            >
              <div className="work-card-media">
                <ProjectMedia project={project} />
                <span className="work-card-shine" />
              </div>

              <div className="work-card-body">
                <div className="work-card-meta">
                  <span>{project.type || project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h3 className="work-card-title">{project.title}</h3>
                <p className="work-card-desc">{project.desc}</p>
                <div className="work-card-tags">
                  {(project.tags || project.stack || []).map((tag) => {
                    const techKey = String(tag).toLowerCase();
                    return (
                      <span
                        className={highlightedTech.has(techKey) ? "work-tag is-highlight" : "work-tag"}
                        key={tag}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
