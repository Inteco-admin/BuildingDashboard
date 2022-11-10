import getForgeAuthToken from "@/utls/forgeAuth";
import Bus from "@/Bus";
/* global Autodesk */

function getProps(model, dbIds) {
    return new Promise((resolve, reject) => {
        model.getBulkProperties2(dbIds, {
            propFilter: ['ИНТ_Этаж', 'Id'],
            categoryFilter: ['Объект']
        },
            result => {
                if (result) return resolve(result);
            },
            er => {
                console.warn(er)
                return reject(er);
            }
        )
    })
}

export async function GetAllValidElements(model) {
    const dbIds = await model.findProperty("ИНТ_Этаж")

    const elements = await getProps(model, dbIds)
    if (elements) {
        return elements
    }
}

export function LoadViewer() {
    let viewer;


    var options = {
        env: "AutodeskProduction",
        api: "derivativeV2", // for models uploaded to EMEA change this option to 'streamingV2_EU'
        getAccessToken: getForgeAuthToken
    }


    Autodesk.Viewing.Initializer(options, () => {
        var htmlDiv = document.getElementById("forgeViewer");

        viewer = new Autodesk.Viewing.GuiViewer3D(htmlDiv);
        var startedCode = viewer.start();
        if (startedCode > 0) {
            console.error(
                "Failed to create a Viewer: WebGL not supported."
            );

            return;
        }
        viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
            Bus.$emit("model loaded", viewer)
        })
        Bus.$emit("viewer init complied", viewer)
    })


    console.log("Initialization complete, loading a model next...");

}

export function LoadModel(urn, viewer) {
    var documentId = urn ? "urn:" + urn :
        "urn:dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLmR5b3lYNHBNUVE2QlotYTAyaTYxSGc_dmVyc2lvbj0x";
    Autodesk.Viewing.Document.load(
        documentId,
        (viewerDocument) => {
            var defaultModel = viewerDocument
                .getRoot()
                .getDefaultGeometry();
            viewer.loadDocumentNode(viewerDocument, defaultModel);

            Bus.$emit("elements list ready", { viewer: viewer, elements: null })
        },
        onDocumentLoadFailure
    );

    function onDocumentLoadFailure() {
        console.error("Failed fetching Forge manifest");
    }
}
