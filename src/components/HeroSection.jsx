import { Link } from 'react-router-dom';
import { CATEGORIES, TAG_COLORS } from '../data/samplePosts';

function HeroSection() {
    return (
        <section className="hero">
            <div className="container">
                <h1 className="animate-fade-in-up" style={{ opacity: 0 }}>
                    Trinetra <span className="gradient-text">SOCOps</span> — Protect. Detect. Respond
                </h1>
                <p
                    className="animate-fade-in-up stagger-2"
                    style={{ opacity: 0 }}
                >
                    DO SOMETHING GREAT
                </p>
                <div
                    className="hero-categories animate-fade-in-up stagger-3"
                    style={{ opacity: 0 }}
                >
                    {CATEGORIES.map((cat) => {
                        const color = TAG_COLORS[cat] || TAG_COLORS.default;
                        return (
                            <Link
                                to={`/category/${encodeURIComponent(cat)}`}
                                key={cat}
                                className={`tag tag-${color}`}
                                style={{ fontSize: '0.8rem', padding: '6px 16px' }}
                            >
                                {cat}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
