import Link from "next/link";
import Icon from "@/components/ui/Icon";
import styles from "./home.module.css";

const previewTasks = [
  {
    title: "Design landing page",
    priority: "High",
    done: true,
  },
  {
    title: "Ship authentication",
    priority: "Medium",
    done: true,
  },
  {
    title: "Review API routes",
    priority: "High",
    done: false,
  },
  {
    title: "Polish dashboard UI",
    priority: "Low",
    done: false,
  },
] as const;

const features = [
  {
    number: "01",
    icon: "dashboard",
    title: "The big picture.",
    description:
      "See your tasks, priorities, and progress together in one focused dashboard.",
    color: "yellow",
  },
  {
    number: "02",
    icon: "tasks",
    title: "Plan with purpose.",
    description:
      "Create tasks, set deadlines, organize priorities, and know what comes next.",
    color: "mint",
  },
  {
    number: "03",
    icon: "check",
    title: "Progress feels good.",
    description:
      "Mark tasks as complete and watch your progress grow, one step at a time.",
    color: "lavender",
  },
] as const;

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.header}>
        <div className={styles.container}>
          <nav
            className={styles.nav}
            aria-label="Main navigation"
          >
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>
                <Icon name="logo" />
              </span>

              <span>
                taskflow<span className={styles.brandDot}>.</span>
              </span>
            </Link>

            <div className={styles.navLinks}>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
            </div>

            <div className={styles.navActions}>
              <Link href="/login" className={styles.loginLink}>
                Log in
              </Link>

              <Link href="/register" className={styles.navButton}>
                Get started
                <Icon name="arrow" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main" className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <div className={styles.announcement}>
                  <span className={styles.announcementIcon}>
                    <Icon name="spark" />
                  </span>
                  YOUR SPACE TO GET THINGS DONE
                </div>

                <h1 className={styles.heroTitle}>
                  Big ideas.
                  <br />
                  Small steps.
                  <br />
                  <span className={styles.titleHighlight}>
                    Real progress.
                  </span>
                </h1>

                <p className={styles.heroDescription}>
                  Less chaos. More clarity. Keep your tasks
                  organized, your priorities in check, and your
                  momentum going—all in one happy little workspace.
                </p>

                <div className={styles.heroActions}>
                  <Link
                    href="/register"
                    className={styles.primaryButton}
                  >
                    Start organizing
                    <Icon name="arrow" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className={styles.secondaryButton}
                  >
                    Open workspace
                    <Icon name="dashboard" />
                  </Link>
                </div>

                <div className={styles.heroFootnote}>
                  <span className={styles.footnoteSpark}>
                    ✳
                  </span>
                  A little more focus. A little more flow.
                </div>
              </div>

              {/* Product preview */}
              <div className={styles.previewArea}>
                <div className={styles.previewDecor} aria-hidden="true">
                  ✳
                </div>

                <div
                  className={styles.preview}
                  aria-label="Illustrative TaskFlow dashboard preview"
                >
                  <div className={styles.previewTopbar}>
                    <div className={styles.windowDots} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>

                    <span>YOUR WORKSPACE</span>

                    <span className={styles.previewTag}>
                      PREVIEW
                    </span>
                  </div>

                  <div className={styles.previewBody}>
                    <div className={styles.previewHeading}>
                      <div>
                        <p className={styles.previewEyebrow}>
                          TODAY&apos;S FOCUS
                        </p>
                        <h2>Make it happen.</h2>
                      </div>

                      <span className={styles.previewStar}>
                        <Icon name="spark" />
                      </span>
                    </div>

                    <div className={styles.previewProgress}>
                      <div className={styles.progressText}>
                        <span>Daily progress</span>
                        <strong>50%</strong>
                      </div>
                      <div className={styles.progressTrack}>
                        <span />
                      </div>
                    </div>

                    <div className={styles.previewTasks}>
                      {previewTasks.map((task) => (
                        <div
                          key={task.title}
                          className={styles.previewTask}
                        >
                          <span
                            className={`${styles.checkbox} ${
                              task.done ? styles.checkboxDone : ""
                            }`}
                          >
                            {task.done && <Icon name="check" />}
                          </span>

                          <span
                            className={`${styles.previewTaskTitle} ${
                              task.done ? styles.taskDone : ""
                            }`}
                          >
                            {task.title}
                          </span>

                          <span
                            className={`${styles.priority} ${
                              task.priority === "High"
                                ? styles.priorityHigh
                                : task.priority === "Medium"
                                  ? styles.priorityMedium
                                  : styles.priorityLow
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.previewFooter}>
                    <span>02 of 04 tasks completed</span>
                    <Icon name="arrowUp" />
                  </div>
                </div>

                <div className={styles.sticker} aria-hidden="true">
                  ONE
                  <br />
                  STEP
                  <br />
                  AT A TIME!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative strip */}
        <div className={styles.strip}>
          <div className={styles.stripInner}>
            <span>PLAN CLEARLY</span>
            <span>✳</span>
            <span>FOCUS DEEPLY</span>
            <span>✳</span>
            <span>FINISH PROUDLY</span>
            <span>✳</span>
            <span>REPEAT</span>
          </div>
        </div>

        {/* Features */}
        <section
          className={styles.features}
          id="features"
        >
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionLabel}>
                  <Icon name="spark" />
                  THE GOOD STUFF
                </p>

                <h2>
                  Everything you need.
                  <br />
                  <span>Nothing you don&apos;t.</span>
                </h2>
              </div>

              <p>
                Simple tools for the things that actually
                matter. Make space for your best work.
              </p>
            </div>

            <div className={styles.featureGrid}>
              {features.map((feature) => (
                <article
                  key={feature.number}
                  className={`${styles.featureCard} ${
                    styles[feature.color]
                  }`}
                >
                  <div className={styles.featureTop}>
                    <span>{feature.number} / 03</span>
                    <Icon name="arrowUp" />
                  </div>

                  <div className={styles.featureIcon}>
                    <Icon name={feature.icon} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          className={styles.howSection}
          id="how-it-works"
        >
          <div className={styles.container}>
            <div className={styles.howGrid}>
              <div>
                <p className={styles.sectionLabel}>
                  SMALL STEPS. BIG DIFFERENCE.
                </p>

                <h2>
                  Your workflow,
                  <br />
                  simplified<span className={styles.brandDot}>.</span>
                </h2>
              </div>

              <div className={styles.steps}>
                <div className={styles.step}>
                  <span>01</span>
                  <div>
                    <h3>Write it down.</h3>
                    <p>Turn ideas into clear, actionable tasks.</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <span>02</span>
                  <div>
                    <h3>Make a plan.</h3>
                    <p>Choose priorities and set your deadlines.</p>
                  </div>
                </div>

                <div className={styles.step}>
                  <span>03</span>
                  <div>
                    <h3>Get it done.</h3>
                    <p>Check things off and track your progress.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <div className={styles.ctaBox}>
              <span className={styles.ctaStar} aria-hidden="true">
                ✳
              </span>

              <p className={styles.sectionLabel}>
                YOUR NEXT STEP STARTS HERE
              </p>

              <h2>
                Make room for
                <br />
                <em>what matters.</em>
              </h2>

              <p>
                Your ideas deserve more than a forgotten
                to-do list.
              </p>

              <Link
                href="/register"
                className={styles.ctaButton}
              >
                Let&apos;s get started
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <Link href="/" className={styles.footerBrand}>
              taskflow<span className={styles.brandDot}>.</span>
            </Link>

            <span>Paper, ink, and a little possibility.</span>

            <div>
              <Link href="/login">Login</Link>
              <Link href="/register">Get started</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}