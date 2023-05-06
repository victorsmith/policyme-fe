import Image from 'next/image';
import { Inter } from 'next/font/google';

import HomeFeature from '@/components/HomeFeature';
import Map from '@/components/charts/Map';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<main>
			{/* <div className="flex flex-col items-center justify-center">
				<h1 className="text-4xl font-bold text-center">
					Welcome to <span className="text-blue-600">PolicyTree</span>{' '}.
				</h1>
        <h1>
					The best place to analyze & visualize{' '}
					<span className="text-blue-600">completley pointless data</span> about
					the insurance industry.
        </h1>
			</div> */}
			{/* <HomeFeature></HomeFeature> */}
			<Map></Map>
		</main>
	);
}
