import { useLocalSearchParams } from "expo-router";
import EditGiftForm from "../../components/EditGiftForm";

export default function EditWish() {
  const { giftId, giftName, giftLink, giftImage, giftDescription } =
    useLocalSearchParams();

  return (
    <EditGiftForm
      giftId={giftId}
      initialName={giftName}
      initialLink={giftLink}
      initialImage={giftImage}
      initialDescription={giftDescription}
      mode="wish"
    />
  );
}
