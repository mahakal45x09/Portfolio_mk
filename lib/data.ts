import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'ketanmahakal123@gmail.com',

    emailSubject: "Let's collaborate on an AI/ML project",
    emailBody: 'Hi Ketan, I am reaching out to you regarding...',

    oldPortfolio: '#',
    upworkProfile: 'https://github.com/mahakal45x09',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/mahakal45x09' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/ketanmahakal4509' },
];

export const MY_STACK = {
    'AI & ML Frameworks': [
        {
            name: 'Python',
            icon: '/logo/python.svg',
        },
        {
            name: 'PyTorch',
            icon: '/logo/pytorch.svg',
        },
        {
            name: 'TensorFlow',
            icon: '/logo/tensorflow.svg',
        },
        {
            name: 'Scikit-Learn',
            icon: '/logo/scikitlearn.svg',
        },
        {
            name: 'OpenCV',
            icon: '/logo/opencv.svg',
        },
        {
            name: 'Hugging Face',
            icon: '/logo/huggingface.svg',
        },
        {
            name: 'LangChain',
            icon: '/logo/langchain.svg',
        },
    ],
    'Data Science & Analysis': [
        {
            name: 'Pandas',
            icon: '/logo/pandas.svg',
        },
        {
            name: 'NumPy',
            icon: '/logo/numpy.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
    ],
    'Backend & Deployment': [
        {
            name: 'FastAPI',
            icon: '/logo/fastapi.svg',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'AI Resume Roaster & Analyzer',
        slug: 'resume-roaster',
        techStack: [
            'Python',
            'GPT-4 API',
            'LangChain',
            'Next.js',
            'PostgreSQL',
            'Tailwind CSS',
        ],
        thumbnail: '/projects/thumbnail/resume-roaster.jpg',
        longThumbnail: '/projects/long/resume-roaster.jpg',
        images: [
            '/projects/images/resume-roaster-1.png',
            '/projects/images/resume-roaster-2.png',
            '/projects/images/resume-roaster-3.png',
        ],
        liveUrl: '#',
        year: 2024,
        description:
            'AI-powered web application built for resume parsing, scoring, and generating actionable career feedback using GPT-4 and RAG architecture. Designed for automated resume optimization and applicant skill gap analysis.',
        role: `Lead AI/ML Engineer:<br/>
        - Implemented document processing and chunking pipeline with LangChain.<br/>
        - Fine-tuned prompt chains for contextual resume evaluation and scoring.<br/>
        - Deployed scalable backend endpoints using FastAPI and Next.js.`,
    },
    {
        title: 'Smart Vision Defect Detector',
        slug: 'vision-defect-detector',
        techStack: [
            'PyTorch',
            'OpenCV',
            'YOLOv8',
            'FastAPI',
            'Docker',
            'Streamlit',
        ],
        thumbnail: '/projects/thumbnail/epikcart.jpg',
        longThumbnail: '/projects/long/epikcart.jpg',
        images: [
            '/projects/images/epikcart-1.png',
            '/projects/images/epikcart-2.png',
            '/projects/images/epikcart-3.png',
        ],
        liveUrl: '#',
        year: 2024,
        description: `A real-time Computer Vision system designed to detect surface anomalies and manufacturing defects in industrial video streams. Built using YOLOv8 object detection, OpenCV image preprocessing, and high-performance inference serving.`,
        role: `AI/ML Engineer: <br/>
        - Collected and annotated 5000+ industrial inspection image datasets.<br/>
        - Trained custom YOLOv8 detection models achieving 94.2% mAP accuracy.<br/>
        - Built real-time inference API stream processing 60 FPS using TensorRT optimization.`,
    },
    {
        title: 'Predictive Customer Churn Engine',
        slug: 'churn-predictor',
        techStack: [
            'Python',
            'Scikit-Learn',
            'XGBoost',
            'Pandas',
            'Flask',
            'Docker',
        ],
        thumbnail: '/projects/thumbnail/property-pro.jpg',
        longThumbnail: '/projects/long/property-pro.jpg',
        images: [
            '/projects/images/property-pro-1.png',
            '/projects/images/property-pro-2.png',
            '/projects/images/property-pro-3.png',
        ],
        liveUrl: '#',
        year: 2023,
        description:
            'End-to-end Machine Learning pipeline for predicting enterprise customer churn risk based on user activity logs, financial telemetry, and behavioral metadata.',
        role: `Machine Learning Engineer:<br/>
        - Performed exploratory data analysis, feature engineering, and SMOTE class balancing.<br/>
        - Evaluated Random Forest, LightGBM, and XGBoost models, achieving 0.91 ROC-AUC score.<br/>
        - Packaged ML pipeline into a containerized REST API deployed with Docker on AWS.`,
    },
    {
        title: 'Conversational LLM Knowledge Assistant',
        slug: 'rag-knowledge-bot',
        techStack: ['LangChain', 'Hugging Face', 'FAISS', 'FastAPI', 'React'],
        thumbnail: '/projects/thumbnail/devLinks.jpg',
        longThumbnail: '/projects/long/devLinks.jpg',
        images: [
            '/projects/images/devLinks-1.png',
            '/projects/images/devLinks-2.png',
            '/projects/images/devLinks-3.png',
        ],
        liveUrl: '#',
        year: 2023,
        description: `Retrieval-Augmented Generation (RAG) system enabling internal teams to query enterprise documentation via natural language. Uses vector database search (FAISS) and open-source LLM embeddings.`,
        role: `AI Developer:<br/>
        - Developed document embedding & indexing workflow with Sentence-Transformers and FAISS.<br/>
        - Created interactive conversational UI with streaming response support.`,
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'AI / ML Engineer',
        company: 'AI Research & Solutions',
        duration: '2024 - Present',
    },
    {
        title: 'Machine Learning Engineer',
        company: 'Tech Solutions Lab',
        duration: '2023 - 2024',
    },
    {
        title: 'Data Science & ML Intern',
        company: 'Innovate AI',
        duration: '2022 - 2023',
    },
];
