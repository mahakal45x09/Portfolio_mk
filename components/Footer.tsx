import { GENERAL_INFO } from '@/lib/data';

const Footer = () => {
    return (
        <footer className="text-center pb-8 pt-12 border-t border-neutral-800/50" id="contact">
            <div className="container mx-auto px-4">
                <p className="text-lg text-neutral-400 font-medium tracking-wide">Have a project or research collaboration in mind?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(GENERAL_INFO.emailSubject)}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`}
                    className="text-3xl sm:text-5xl font-anton inline-block mt-4 mb-8 bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                    {GENERAL_INFO.email}
                </a>

                <div className="pt-4 border-t border-neutral-800/40 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-neutral-400">
                        © {new Date().getFullYear()} Ketan Mahakal • AI & ML Engineer
                    </p>
                    <div className="flex items-center gap-6 text-sm text-neutral-400">
                        <a href={GENERAL_INFO.upworkProfile} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/ketanmahakal" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            LinkedIn
                        </a>
                        <a href="https://www.kaggle.com/ketanmahakal" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Kaggle
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
