import { Wrapper } from "@googlemaps/react-wrapper";
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps}: AppProps) {
    return(
        <Wrapper
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
            libraries={['places', 'geometry']}
            language={'ro'}
        >
            <Component {...pageProps}/>
        </Wrapper>
    );
};