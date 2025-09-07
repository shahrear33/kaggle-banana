/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: 'var(--primary)',
  			'primary-dark': 'var(--primary-dark)',
  			'primary-light': 'var(--primary-light)',
  			'primary-100': 'var(--primary-100)',
  			'primary-200': 'var(--primary-200)',
  			'primary-500': 'var(--primary-500)',
  			'primary-600': 'var(--primary-600)',
  			'primary-800': 'var(--primary-800)',
  			'primary-outline': 'var(--primary-outline)',
  			'primary-icon': 'var(--primary-icon)',
  			'text-primary': 'var(--text-primary)',
  			'main-border': 'var(--main-border)',
  			'menu-bg': 'var(--menu-bg)',
  			'main-bg': 'var(--main-bg)',
  			'menu-border': 'var(--menu-border)',
  			blue: 'var(--blue)',
  			'blue-20': 'var(--blue-20)',
  			'blue-100': 'var(--blue-100)',
  			'light-blue': 'var(--light-blue)',
  			green: 'var(--green)',
  			'green-100': 'var(--green-100)',
  			'green-2': 'var(--green-2)',
  			'green-20': 'var(--green-20)',
  			'green-soft': 'var(--green-soft)',
  			'green-dark': 'var(--green-dark)',
  			'green-light': 'var(--green-light)',
  			'green-border-outline': 'var(--green-border-outline)',
  			'green-bg-outline': 'var(--green-bg-outline)',
  			'green-text-outline': 'var(--green-text-outline)',
  			'green-outline': 'var(--green-outline)',
  			yellow: 'var(--yellow)',
  			'yellow-20': 'var(--yellow-20)',
  			'yellow-100': 'var(--yellow-100)',
  			'yellow-light': 'var(--yellow-light)',
  			'cyan-outline': 'var(--cyan-outline)',
  			'cyan-icon': 'var(--cyan-icon)',
  			'violate-10': 'var(--violate-10)',
  			'violate-50': 'var(--violate-50)',
  			'violate-100': 'var(--violate-100)',
  			'text-white': 'var(--text-white)',
  			black: 'var(--black)',
  			'white-icon': 'var(--white-icon)',
  			'dark-1': 'var(--dark-1)',
  			'dark-2': 'var(--dark-2)',
  			'dark-3': 'var(--dark-3)',
  			'mid-1': 'var(--mid-1)',
  			grey: 'var(--grey)',
  			'grey-1': 'var(--grey-1)',
  			'grey-2': 'var(--grey-2)',
  			'light-gray': 'var(--light-gray)',
  			'stay-white': 'var(--stay-white)',
  			'stay-white-60': 'var(--stay-white-60)',
  			pink: 'var(--pink)',
  			'pink-soft': 'var(--pink-soft)',
  			turquoise: 'var(--turquoise)',
  			red: 'var(--red)',
  			'red-20': 'var(--red-20)',
  			'red-100': 'var(--red-100)',
  			'red-light': 'var(--red-light)',
  			orange: 'var(--orange)',
  			'orange-20': 'var(--orange-20)',
  			'orange-light': 'var(--orange-light)',
  			'orange-100': 'var(--orange-100)',
			'orange-dark': '#EC672B',
  			'orange-border-outline': 'var(--orange-border-outline)',
  			'orange-bg-outline': 'var(--orange-bg-outline)',
  			'orange-text-outline': 'var(--orange-text-outline)',
  			'orange-soft': 'var(--orange-soft)',
  			'grey-light': 'var(--grey-light)',
  			'background-2': 'var(--background-2)',
  			'background-100': 'var(--background-100)',

			'primary-soft': '#e6efff',
			'primary-soft-hover': '#d1e3ff',
			'success-soft': '#e6f9f1',
			'success-soft-hover': '#d1f3e7',
			'danger-soft': '#fee6e6',
			'danger-soft-hover': '#fdd1d1',
			'warning-soft': '#fef9e6',
			'warning-soft-hover': '#fdf3d1',
			
  			off: 'var(--off)',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
