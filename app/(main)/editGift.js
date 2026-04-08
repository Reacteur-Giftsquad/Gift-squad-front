import { useLocalSearchParams } from "expo-router";
import EditGiftForm from "../../components/EditGiftForm";

export default function EditGift() {
  const {
    giftId,
    giftName,
    giftPrice,
    giftLink,
    giftImage,
    giftDescription,
    mode,
  } = useLocalSearchParams();

  return mode === "gift" ? (
    <EditGiftForm
      giftId={giftId}
      initialName={giftName}
      initialPrice={giftPrice}
      initialLink={giftLink}
      initialImage={giftImage}
      mode="gift"
    />
  ) : (
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
