import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit } from "@angular/core";

import * as d3 from "d3";
import * as erd from "element-resize-detector";
import { RepoSearchResultItem } from "src/models/repo-search-result.model";

@Component({
  selector: "app-repo-info-chart",
  templateUrl: "./repo-info-chart.component.html",
  styleUrls: ["./repo-info-chart.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoInfoChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  constructor(private readonly elRef: ElementRef<HTMLElement>) {}
  @Input() repo: RepoSearchResultItem;
  @Input() animate: boolean;
  @Input() barGap = 0.1;
  @Input() fontSize = 1;

  private width;
  private height;
  private padding;
  private labelWidth;

  private svg;

  private xScale;
  private yScale;

  private labelsNode;
  private valuesNode;
  private plotNode;

  private data: number[] = [];
  private labels: string[];

  colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"];
  colorScale;
  erd;

  private initalized = false;

  ngOnInit() {
    this.data = [this.repo.forks_count, this.repo.stargazers_count, this.repo.open_issues_count];
    this.labels = ["Forks", "Stars", "Issues"];
  }

  ngAfterViewInit() {
    this.updateDimensions();
    this.buildSvg();

    this.buildXScale();
    this.buildYScale();
    this.setColorScale();

    this.setLabels();
    this.plotData();

    this.initalized = true;
  }

  ngOnDestroy() {
    if (!this.elRef) {
      return;
    }
    this.erd.uninstall(this.elRef.nativeElement);
  }

  ngOnChanges() {
    if (!this.elRef || !this.initalized) {
      /** Do not try to render if there is no browser context */
      return;
    }
    this.updateDimensions();
    this.resizeSvg();
    this.buildXScale();
    this.buildYScale();
    this.updateData();
  }

  private onResize(element) {
    this.updateDimensions();
    this.resizeSvg();

    this.buildXScale();
    this.buildYScale();

    this.updateData();
  }

  private updateDimensions() {
    const el = this.elRef.nativeElement;
    const availableWidth = el.clientWidth;
    this.height = el.clientHeight;
    this.labelWidth = Math.max(...this.labels.map((l) => l.length)) * 10;
    this.padding = Math.min(availableWidth, this.height) / 10;
    this.width = Math.max(availableWidth, this.labelWidth * 3 + this.padding * 2);
  }

  private resizeSvg() {
    this.svg
      .attr("width", `${this.width}px`)
      .attr("height", `${this.height}px`)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);
  }

  private buildSvg() {
    const el = this.elRef.nativeElement;

    this.svg = d3
      .select(el)
      .append("svg")
      .attr("width", `${this.width}px`)
      .attr("height", `${this.height}px`)
      .attr("viewBox", `0 0 ${this.width} ${this.height}`);

    this.labelsNode = this.svg.append("g");
    this.valuesNode = this.svg.append("g");
    this.plotNode = this.svg.append("g");

    this.erd = erd();
    this.erd.listenTo(el, this.onResize.bind(this));
  }

  private setLabels() {
    this.labelsNode.selectAll("*").remove();
    this.labelsNode
      .selectAll("text")
      .data(this.labels)
      .enter()
      .append("text")
      .text((d, i) => (i < this.data.length ? d : ""))
      .attr("text-anchor", "end")
      .style("font-size", `${this.fontSize}rem`)
      .attr("x", this.labelWidth)
      .attr("y", (d, i) => this.yScale((i + 0.75) / this.data.length));
  }

  private plotData() {
    this.plotNode.selectAll("*").remove();
    this.valuesNode.selectAll("*").remove();
    if (this.data.length > 0) {
      if (this.animate) {
        this.plotNode
          .selectAll("rect")
          .data(this.data)
          .enter()
          .append("rect")
          .attr("fill", (d, i) => this.colorScale(i))
          .attr("x", (d) => this.labelWidth + this.padding)
          .attr("width", 0)
          .attr("y", (d, i) => this.yScale((i + this.barGap) / this.data.length))
          .attr(
            "height",
            (d, i) => this.yScale((i + (1 - this.barGap)) / this.data.length) - this.yScale((i + this.barGap) / this.data.length)
          )
          .transition()
          .duration(1000)
          .attr("x", (d) => this.labelWidth + this.padding)
          .attr("width", (d) => Math.max(this.xScale(d), 0));

        this.valuesNode
          .selectAll("text")
          .data(this.data)
          .enter()
          .append("text")
          .text((d, i) => (i < this.data.length ? d : ""))
          .attr("text-anchor", "start")
          .style("font-size", `${this.fontSize}rem`)
          .attr("x", (d) => this.labelWidth + this.padding * 2)
          .attr("y", (d, i) => this.yScale((i + 0.75) / this.data.length))
          .transition()
          .duration(1000)
          .attr("x", (d) => this.labelWidth + this.padding * 2 + this.xScale(d));
      } else {
        this.plotNode
          .selectAll("rect")
          .data(this.data)
          .enter()
          .append("rect")
          .attr("fill", (d, i) => this.colorScale(i))
          .attr("x", (d) => this.labelWidth + this.padding)
          .attr("width", (d) => Math.max(this.xScale(d), 0))
          .attr("y", (d, i) => this.yScale((i + this.barGap) / this.data.length))
          .attr(
            "height",
            (d, i) => this.yScale((i + (1 - this.barGap)) / this.data.length) - this.yScale((i + this.barGap) / this.data.length)
          );

        this.valuesNode
          .selectAll("text")
          .data(this.data)
          .enter()
          .append("text")
          .text((d, i) => (i < this.data.length ? d : ""))
          .attr("text-anchor", "start")
          .style("font-size", `${this.fontSize}rem`)
          .attr("x", (d) => this.labelWidth + this.padding * 2 + this.xScale(d))
          .attr("y", (d, i) => this.yScale((i + 0.75) / this.data.length));
      }
    }
  }

  private updateData() {
    if (this.animate) {
      this.plotNode
        .selectAll("rect")
        .data(this.data)
        .transition()
        .duration(1000)
        .attr("x", (d) => this.labelWidth + this.padding)
        .attr("width", (d) => Math.max(this.xScale(d), 0));

      this.valuesNode
        .selectAll("text")
        .data(this.data)
        .transition()
        .duration(1000)
        .attr("x", (d) => this.labelWidth + this.padding * 2 + this.xScale(d));
    } else {
      this.plotNode
        .selectAll("rect")
        .data(this.data)
        .attr("x", (d) => this.labelWidth + this.padding)
        .attr("width", (d) => Math.max(this.xScale(d), 0));

      this.valuesNode
        .selectAll("text")
        .data(this.data)
        .attr("x", (d) => this.labelWidth + this.padding * 2 + this.xScale(d));
    }
  }

  private buildYScale() {
    this.yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.height]);
  }

  private buildXScale() {
    const maxValue = Math.max(...this.data);
    this.xScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, this.width - this.labelWidth * 2]);
  }

  private setColorScale() {
    this.colorScale = d3.scaleOrdinal(this.colors);
  }
}
