export interface Program {
	id: string;
	title: string;
	description: string;
	shortDescription: string;
	duration: string;
	level: "undergraduate" | "postgraduate" | "doctoral" | "certificate";
	eligibility: string[];
	curriculum: string[];
	careerProspects: string[];
	highlights: string[];
	image: string;
	slug: string;
	fees?: string;
}

export interface Faculty {
	id: string;
	name: string;
	designation: string;
	specialization: string[];
	education: string[];
	experience: number;
	publications: string[];
	awards?: string[];
	image: string;
	bio: string;
	email?: string;
	researchAreas?: string[];
}

export interface NewsArticle {
	id: string;
	title: string;
	content: string;
	excerpt: string;
	publishDate: Date;
	author: string;
	category: string;
	featuredImage: string;
	slug: string;
	tags?: string[];
}

export interface Event {
	id: string;
	title: string;
	description: string;
	date: Date;
	location: string;
	type: "academic" | "cultural" | "research" | "workshop";
	image?: string;
	registrationRequired: boolean;
	registrationLink?: string;
}

export interface Testimonial {
	id: string;
	name: string;
	program: string;
	year: string;
	image: string;
	quote: string;
	currentPosition?: string;
	company?: string;
}

export interface NavigationItem {
	label: string;
	href: string;
	children?: NavigationItem[];
}

export interface SEOProps {
	title: string;
	description: string;
	keywords?: string;
	image?: string;
	url?: string;
}
