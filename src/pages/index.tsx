import React from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

// SEO Meta Tags
const seoMetaTags = (
  <>
    <meta
      name="description"
      content="ZARISH SPHERE - Comprehensive Healthcare Documentation Platform with FHIR R5 support, EMR/EHR integration, and multi-country healthcare system compatibility for Bangladesh, Thailand, and Myanmar"
    />
    <meta
      name="keywords"
      content="healthcare, FHIR, FHIR R5, documentation, EMR, EHR, medical records, zarish sphere, bangladesh, thailand, myanmar, healthcare IT, clinical documentation"
    />
    <meta name="author" content="ZARISH SPHERE Team" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ZARISH SPHERE Documentation" />
    <meta property="og:title" content="ZARISH SPHERE - Healthcare Documentation Platform" />
    <meta
      property="og:description"
      content="Comprehensive healthcare documentation platform with FHIR R5 support, EMR/EHR integration, and multi-country healthcare system compatibility"
    />
    <meta property="og:url" content="https://docs.zarishsphere.com" />
    <meta
      property="og:image"
      content="https://docs.zarishsphere.com/img/zs-docs-banner-small.png"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@zarishsphere" />
    <meta name="twitter:creator" content="@zarishsphere" />
    <meta name="twitter:title" content="ZARISH SPHERE - Healthcare Documentation Platform" />
    <meta
      name="twitter:description"
      content="Comprehensive healthcare documentation platform with FHIR R5 support, EMR/EHR integration, and multi-country healthcare system compatibility"
    />
    <meta
      name="twitter:image"
      content="https://docs.zarishsphere.com/img/zs-docs-banner-small.png"
    />
    <meta property="og:type" content="website" />
  </>
);

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Getting Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout>
      {seoMetaTags}
      <HomepageHeader />
      <main></main>
    </Layout>
  );
}
