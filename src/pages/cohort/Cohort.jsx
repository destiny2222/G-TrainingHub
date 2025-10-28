import React from 'react'
import './Cohort.css'

function Cohort() {
    return (
        <>
            <section className="breadcrumb-area cohort-hero-section pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="hero-content">
                                <h1>Cohorts <span className="primary-color">Overview</span></h1>
                                <p>Browse active cohorts, upcoming start dates, and enrolled participants for our training programs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="resources-section pt-100 pb-100">
                <div className="container">
                    <div className="resources-wrap">
                        <aside className="sidebar">
                            <div className="filters">
                                <h4>Filters</h4>
                                <div className="filter-group">
                                    <label>Topics</label>
                                    <ul>
                                        <li>Machine Learning</li>
                                        <li>Data Visualization</li>
                                        <li>Natural Language</li>
                                    </ul>
                                </div>
                                <div className="filter-group">
                                    <label>Format</label>
                                    <ul>
                                        <li>Video</li>
                                        <li>Article</li>
                                        <li>Dataset</li>
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        <main className="main-content">
                            <div className="resources-header">
                                <h2>Free Curated AI And Data Resources</h2>
                                <div className="search-row">
                                    <input className="search-input" placeholder="Ask AI Tutor about this document" />
                                </div>
                            </div>

                            <div className="cards-grid">
                                <article className="card">
                                    <div className="card-img" style={{backgroundImage: 'linear-gradient(180deg,#1f2933,#111418)'}} />
                                    <div className="card-body">
                                        <div className="tags">
                                            <span className="tag video">Video</span>
                                            <span className="tag level">Beginner</span>
                                        </div>
                                        <h3 className="card-title">Intro to Neural Networks</h3>
                                        <p className="card-desc">A comprehensive introduction to the fundamentals of neural networks and deep learning.</p>
                                        <div className="card-actions">
                                            <button className="ask-btn">Ask AI Tutor</button>
                                        </div>
                                    </div>
                                </article>

                                <article className="card">
                                    <div className="card-img" style={{backgroundImage: 'linear-gradient(180deg,#2a3a48,#0f1720)'}} />
                                    <div className="card-body">
                                        <div className="tags">
                                            <span className="tag article">Article</span>
                                            <span className="tag level orange">Intermediate</span>
                                        </div>
                                        <h3 className="card-title">Data Visualization with D3.js</h3>
                                        <p className="card-desc">Learn to create beautiful, interactive data visualizations for the web using D3.js.</p>
                                        <div className="card-actions">
                                            <button className="ask-btn">Ask AI Tutor</button>
                                        </div>
                                    </div>
                                </article>

                                <article className="card">
                                    <div className="card-img" style={{backgroundImage: 'linear-gradient(180deg,#1b3a3a,#071019)'}} />
                                    <div className="card-body">
                                        <div className="tags">
                                            <span className="tag dataset">Dataset</span>
                                            <span className="tag level red">Advanced</span>
                                        </div>
                                        <h3 className="card-title">Social Media Sentiment Analysis</h3>
                                        <p className="card-desc">A large-scale dataset of social media posts for sentiment analysis and NLP tasks.</p>
                                        <div className="card-actions">
                                            <button className="ask-btn">Ask AI Tutor</button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Cohort
