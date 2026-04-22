const SESSION_KEY = "cinecaptcha_session";

export function getSessionId() {
	if (typeof window === "undefined") return "";
	let id = localStorage.getItem(SESSION_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(SESSION_KEY, id);
	}
	return id;
}

export function getCompletedDate(date) {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(`completed_${date}`);
}

export function markDateCompleted(date, shareString) {
	if (typeof window === "undefined") return;
	localStorage.setItem(`completed_${date}`, shareString);
}
