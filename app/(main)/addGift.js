import { useLocalSearchParams } from "expo-router";
import AddGiftForm from "../../components/AddGiftForm";

export default function AddGift() {
  const { eventId } = useLocalSearchParams();

  return <AddGiftForm eventId={eventId} mode="gift" />;
}
