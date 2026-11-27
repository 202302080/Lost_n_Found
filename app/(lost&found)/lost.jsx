import LostFoundFeed from '../../components/LostFoundFeed'

// Lost and Found share one screen; the LOST/FOUND toggle switches lists in place
export default function LostScreen() {
    return <LostFoundFeed initialType="lost" />
}
