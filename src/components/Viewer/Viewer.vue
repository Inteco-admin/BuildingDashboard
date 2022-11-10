<template>
    <div class="viewer-context">
        <div id="chart-legend" class="panel-body">

            <div class="legend-value">
                <div class="legend-block" style="background-color: #87b340;"></div>Завершено
            </div>
            <div class="legend-value">
                <div class="legend-block" style="background-color: #faa21b;"></div>Запланировано
            </div>
            <div class="legend-value">
                <div class="legend-block" style="background-color: #dd2222;"></div>Просрочено
            </div>
        </div>
        <div id="forgeViewer"></div>
    </div>
</template>

<script>
/* global THREE */

import { GetAllValidElements, LoadModel, LoadViewer } from "./ViewerToolkit";
import Bus from "@/Bus";
import { getDataFromProject } from "@/utls/projectApiClient.js";

export default {
    data() {
        return {
            viewer: null,
            validElements: [],
            model: null,
            requiredModel: null,
            dataFromProjectAPI: [],
            requiredDate: new Date(
                Date.now() - new Date().getTimezoneOffset() * 60000
            )
                .toISOString()
                .substr(0, 10),
            elementsWithProblem: [],
        };
    },

    mounted() {
        Bus.$on("viewer init complied", (viewer) => {
            this.viewer = viewer;
        });

        Bus.$on("reload model", (req) => {
            if (
                this.requiredModel &&
                this.requiredModel.urn == req.requiredModel.urn
            ) {
                Bus.$emit("model loaded", {
                    model: this.model,
                    target: this.viewer,
                });
                return;
            }
            this.requiredModel = req.requiredModel;
            this.requiredDate = req.date;
            this.validElements = [];
            this.elementsWithProblem = [];
            this.model = null;
            LoadModel(this.requiredModel.urn, this.viewer);
        });

        Bus.$on("model loaded", async (data) => {
            this.model = data.model;
            this.viewer = data.target;
            this.validElements = await GetAllValidElements(this.model);
            this.sendLevelList();
            this.setAllElementsWhite();
            this.dataFromProjectAPI = getDataFromProject(
                this.requiredModel.modelFilter,
                this.requiredDate
            );
            this.coloringElementByProjectData();
            Bus.$emit("colored", {});
            this.viewer.setGhosting(false);
        });

        Bus.$on("level selected", (item) => {
            const filteredElements = this.validElements.filter((el) => {
                return (
                    el.properties[1] && el.properties[1].displayValue == item
                );
                // el.properties[1].displayValue == item
            });
            const dbIdsToIsolate = filteredElements.map((el) => el.dbId);
            this.viewer.isolate(dbIdsToIsolate);
        });

        Bus.$on("showProblems", () => {
            this.viewer.isolate(this.elementsWithProblem);
            this.viewer.setGhosting(true);
        });

        Bus.$on("showAll", () => {
            this.viewer.showAll();
            this.viewer.setGhosting(false);
        });

        LoadViewer();
    },

    methods: {
        sendLevelList() {
            let levels = [];
            this.validElements.map((el) => {
                if (el.properties[1]) {
                    levels.push(parseInt(el.properties[1].displayValue));
                }
            });

            let filteredLevels = [...new Set(levels)]
                .filter((el) => !Number.isNaN(el))
                .sort(function (a, b) {
                    return a - b;
                });

            Bus.$emit("level-list ready", filteredLevels);
        },
        setAllElementsWhite() {
            this.validElements.forEach((x) => {
                this.coloringElement(x.dbId, "white");
            });
            console.log("set all elements to white");
        },

        coloringElementByProjectData() {
            // prepare merged array from all elements and elements who have color from project data
            // merged by model id
            // let elementsForColoring = new Array();
            const ModelIdFromAPI = new Map();
            this.dataFromProjectAPI.forEach((x) =>
                ModelIdFromAPI.set(x.modelid, x.color)
            );

            this.validElements.forEach((x) => {
                if (ModelIdFromAPI.has(x.properties[0].displayValue)) {
                    const color = ModelIdFromAPI.get(x.properties[0].displayValue)
                    this.coloringElement(x.dbId, color)
                    if (color === 'red') this.elementsWithProblem.push(x.dbId)

                }
            });

            // this.dataFromProjectAPI.forEach((x) => {
            //     let id = x.modelid;

            //     this.validElements.forEach((element) => {
            //         if (element.properties[0].displayValue === id) {
            //             elementsForColoring.push({
            //                 color: x.color,
            //                 id: element.dbId,
            //             });
            //         }
            //     });
            // };

            // coloring this elements

            // elementsForColoring.forEach((x) => {
            //     this.coloringElement(x.id, x.color);
            //     if (x.color === "red") {
            //         this.elementsWithProblem.push(x.id);
            //     }
            // });
        },

        coloringElement(dbId, color) {
            // https://brand.autodesk.com/brand-elements/colors#product-colors
            // red #dd2222
            // orange #faa21b
            // green #87b340
            // cyan #32bcad
            let inputColor, outputColor;
            switch (color) {
                case "red":
                    inputColor = new THREE.Color(0xdd2222);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;

                case "yellow":
                    inputColor = new THREE.Color(0xfaa21b);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;

                case "green":
                    inputColor = new THREE.Color(0x87b340);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;

                case "cyan":
                    inputColor = new THREE.Color(0x32bcad);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;

                case "white":
                    inputColor = new THREE.Color(0xffffff);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;

                case "blue":
                    inputColor = new THREE.Color(0x26abff);
                    outputColor = new THREE.Vector4(
                        inputColor.r,
                        inputColor.g,
                        inputColor.b,
                        1
                    );

                    break;
            }
            this.viewer.model.setThemingColor(dbId, outputColor, true);
        },
    },
};
</script>

<style>
#forgeViewer {
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: #f0f8ff;
}

.viewer-context {
    position: relative;
    width: 100%;
    min-height: 100%;
    box-shadow: 5px 5px 5px rgba(77, 76, 76, 0.2) !important;
}

#chart-legend {
    position: absolute;
    top: 0;
    left: 5px;
    z-index: 10;
}

.legend-value {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.legend-block {
    width: 20px;
    height: 20px;
    margin-right: 4px;
}
</style>
