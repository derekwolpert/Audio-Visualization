import { returnAnimationStatus } from "../utitlities";

export const waveformLinear = function (analyser, colors) {

    analyser.fftSize = 2048;
    
    const dataArray = !!analyser.getFloatTimeDomainData ? new Float32Array(analyser.fftSize) : [...Array(analyser.fftSize)].map(el => 0);

    const h = window.innerHeight,
        w = window.innerWidth;

    let svg;

    if (document.getElementById('visualizer-svg')) {
        d3.selectAll("svg > *").remove();
    } else {
        d3.selectAll("svg").remove();
        svg = d3.select('body').append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('id', 'visualizer-svg');
    }

    const x = d3.scaleLinear()
        .domain([0, dataArray.length - 1])
        .range([0, w]);

    const y = d3.scaleLinear()
        .domain([-1, 1])
        .range([h, 0]);

    const line = d3.line()
        .x(function (d, i) { return x(i); })
        .y(function (d, i) { return y(d); });

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .attr("color", "transparent");

    const colorScale = d3.scaleSequential(colors)
        .domain([0, 299]);

    const mirrorColorScale = d3.scaleSequential(colors)
        .domain([599, 300]);

    const loopingColor = (num) => {
        return num < 300 ? colorScale(num) : mirrorColorScale(num);
    };

    let colorOffset = 0;

    const setColorOffset = () => {
        colorOffset = (colorOffset + 1) % 600;
    };

    let currentCount = 0;
    currentCount += returnAnimationStatus();

    function renderFrame() {

        if (!!analyser.getFloatTimeDomainData) {

            if (currentCount === returnAnimationStatus()) {
                requestAnimationFrame(renderFrame);
            }

            analyser.getFloatTimeDomainData(dataArray);

            setColorOffset();

            svg.select("path")
                .datum(dataArray)
                .attr("d", line)
                .attr("stroke", function (d) { return loopingColor(colorOffset); })
                .attr("stroke-width", function (d) { return w / 360; });

        } else {

            svg.append("text")
                .text("The Waveform Line visualizer utilizes a feature")
                .attr("y", h / 4)
                .attr("x", w / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", w / 32)
                .attr("font-family", `"Open Sans", sans-serif`)
                .attr("fill", "white");

            svg.append("text")
                .text("not compatible with your web browser.")
                .attr("y", (h / 4) + (w / 32) + 6)
                .attr("x", w / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", w / 32)
                .attr("font-family", `"Open Sans", sans-serif`)
                .attr("fill", "white");

            svg.append("text")
                .text("Please select a different visualizer, or consider using Google Chrome,")
                .attr("y", (h / 4) + (2 * (w / 32)) + 18)
                .attr("x", w / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", w / 48)
                .attr("font-family", `"Open Sans", sans-serif`)
                .attr("fill", "white");

            svg.append("text")
                .text("Microsoft Edge, Mozilla Firefox or Opera for wider compatiblity.")
                .attr("y", (h / 4) + (2 * (w / 32)) + (w / 48) + 24)
                .attr("x", w / 2)
                .attr("text-anchor", "middle")
                .attr("font-size", w / 48)
                .attr("font-family", `"Open Sans", sans-serif`)
                .attr("fill", "white");
        }
    }
    renderFrame();
};