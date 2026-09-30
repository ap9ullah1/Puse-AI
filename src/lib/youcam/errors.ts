const FRIENDLY_MESSAGES: Record<string, string> = {
  error_src_face_too_small:
    "We couldn't get a clear read on your face — move closer or crop tighter so it fills most of the frame.",
  error_below_min_image_size: "That photo's a bit too small. Try one that's at least 480px on the short side.",
  exceed_max_filesize: "That photo's too large. Try a file under 10MB.",
  error_pose: "We couldn't find a face in that photo. Try a clear, forward-facing shot in good light.",
  error_invalid_ref: "That reference image isn't usable — try a different one.",
  error_apply_region_mismatch: "That photo doesn't show enough of the right area. Try a different framing.",
  error_invalid_src: "We need more than just your lower body or feet — try a full, forward-facing shot.",
  error_download_image: "We couldn't load that image. Try uploading it again.",
  error_nsfw_content_detected: "That image couldn't be processed. Try a different photo.",
  error_editing_failed: "The result looked too similar to your original photo. Try a different photo or item.",
  error_no_nail: "We couldn't find a hand in that photo. Try a clear, well-lit shot.",
  error_nail_too_small: "Your hand needs to take up more of the frame. Try moving closer.",
  invalid_parameter: "Something about that request wasn't quite right. Try again.",
  unknown_internal_error: "Something went wrong on our end. Give it another try in a moment.",
  InvalidApiKey: "This app's API key isn't valid. Check YOUCAM_API_KEY in .env.local.",
  InactiveApiKey: "This app's API key is inactive. Check your YouCam account.",
  ExpiredApiKey: "This app's API key has expired. Generate a new one in your YouCam account.",
};

export function friendlyYouCamError(
  code: string | null | undefined,
  fallbackMessage: string | null | undefined
): string {
  if (code && FRIENDLY_MESSAGES[code]) return FRIENDLY_MESSAGES[code];
  if (fallbackMessage) return fallbackMessage;
  return "Something went wrong processing that photo. Try again.";
}
