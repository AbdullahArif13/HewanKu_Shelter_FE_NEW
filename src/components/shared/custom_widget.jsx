"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Padding({
  children,
  top,
  bottom,
  left,
  right,
  horizontal,
  vertical,
  all,
}) {
  const style = {
    paddingTop: all ?? vertical ?? top ?? 0,
    paddingBottom: all ?? vertical ?? bottom ?? 0,
    paddingLeft: all ?? horizontal ?? left ?? 0,
    paddingRight: all ?? horizontal ?? right ?? 0,
  };

  // pastikan nilainya px
  for (const key in style) {
    style[key] = `${style[key]}px`;
  }

  return <div style={style}>{children}</div>;
}

export function SizedBox({ height, width }) {
  return (
    <div
      style={{
        height: height ? `${height}px` : undefined,
        width: width ? `${width}px` : undefined,
      }}
    />
  );
}

export function Text({
  children,
  text, // optional: bisa pakai text="..." atau <Text>...</Text>
  size, // optional: ukuran manual (px)
  color, // optional: warna manual
  weight, // optional: font-weight manual
  align, // optional: text-align manual
  className = "", // tailwind class
}) {
  // style inline opsional
  const style = {
    fontSize: size ? `${size}px` : undefined,
    color,
    fontWeight: weight,
    textAlign: align,
  };

  return (
    <p className={className} style={style}>
      {text || children}
    </p>
  );
}

/**
 * Container — mirip kaya Container di Flutter
 * Bisa ngatur padding, margin, border, background, radius, shadow, dsb.
 *
 * Props:
 * - children: isi di dalam Container
 * - className: tambahan className custom
 * - p, px, py, pt, pb, pl, pr: padding
 * - m, mx, my, mt, mb, ml, mr: margin
 * - bg: warna background (contoh: "bg-white" atau "bg-[#f1f1f1]")
 * - border, borderColor, rounded, shadow: style tambahan
 */
export function Container({
  children,
  className,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  bg,
  border,
  borderColor,
  rounded,
  shadow,
}) {
  const classes = cn(
    // background
    bg,
    // padding
    p && `p-${p}`,
    px && `px-${px}`,
    py && `py-${py}`,
    pt && `pt-${pt}`,
    pb && `pb-${pb}`,
    pl && `pl-${pl}`,
    pr && `pr-${pr}`,
    // margin
    m && `m-${m}`,
    mx && `mx-${mx}`,
    my && `my-${my}`,
    mt && `mt-${mt}`,
    mb && `mb-${mb}`,
    ml && `ml-${ml}`,
    mr && `mr-${mr}`,
    // border
    border && "border",
    borderColor && `border-[${borderColor}]`,
    // rounded corner
    rounded && `rounded-${rounded}`,
    // shadow
    shadow && `shadow-${shadow}`,
    // tambahan custom class
    className
  );

  return <div className={classes}>{children}</div>;
}

// Row = Flex horizontal (Flutter: Row)
export function Row({
  children,
  className,
  mainAxisAlignment = "start", // seperti MainAxisAlignment di Flutter
  crossAxisAlignment = "center", // seperti CrossAxisAlignment di Flutter
  ...props
}) {
  const mainAxisMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const crossAxisMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  return (
    <div
      className={cn(
        "flex flex-row w-full",
        mainAxisMap[mainAxisAlignment],
        crossAxisMap[crossAxisAlignment],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Column = Flex vertical (Flutter: Column)
export function Column({
  children,
  className,
  mainAxisAlignment = "start",
  crossAxisAlignment = "center",
  ...props
}) {
  const mainAxisMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const crossAxisMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        mainAxisMap[mainAxisAlignment],
        crossAxisMap[crossAxisAlignment],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
