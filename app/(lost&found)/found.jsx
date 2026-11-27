import LostFoundFeed from '../../components/LostFoundFeed'

// Opened from the Home screen's FOUND button; same screen as Lost, starting on Found
export default function FoundScreen() {
    return <LostFoundFeed initialType="found" />
}
