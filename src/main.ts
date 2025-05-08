import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

window.addEventListener("DOMContentLoaded", async () => {
    const update = await check();
    if (update) {
        let container = document.querySelector("#update-available");

        if (container) {
            container.innerHTML = `
                <p>Update available ${update.version}</p>
                <p>from ${update.date}</p>
                <p>patch notes:</p>
                <p>from ${update.body}</p>

                <button id="installUpdate">Install Update</button>
            `;

            document.querySelector("#installUpdate")?.addEventListener("click", () => {
                installUpdate();
            });
        }
    }

    async function installUpdate() {
        let downloaded = 0;
        let contentLength = 0;

        await update?.downloadAndInstall((event: any) => {
            switch (event.event) {
                case "Started":
                    contentLength = event.data.contentLength;
                    console.log(
                        `started downloading ${event.data.contentLength} bytes`,
                    );
                    break;
                case "Progress":
                    downloaded += event.data.chunkLength;
                    console.log(
                        `downloaded ${downloaded} from ${contentLength}`,
                    );
                    break;
                case "Finished":
                    console.log("download finished");
                    break;
            }
        });

        console.log("update installed");
        await relaunch();
    }
});
