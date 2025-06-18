import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Auto-Discover Projects',
    emoji: '🔍',
    description: (
      <>
        Automatically detects Node.js, Python, Rust, Go, and web projects in any directory.
        Smart filtering skips build artifacts and caches.
      </>
    ),
  },
  {
    title: 'tmux Integration',
    emoji: '🪟',
    description: (
      <>
        Creates organized tmux sessions with one window per project.
        Navigate with keyboard shortcuts and visual project selector.
      </>
    ),
  },
  {
    title: 'Claude Code Ready',
    emoji: '🤖',
    description: (
      <>
        Built-in Claude Code integration with checkpoint save/restore.
        Launch Claude in any project with <code>Ctrl+b C</code>.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureEmoji}>{emoji}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}