"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { CopyButton, ResetButton, ToolInput, ToolPanel } from "./ToolPrimitives";

function numberValue(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function money(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", { maximumFractionDigits: 0 }).format(Math.max(0, value));
}

function ResultCard({ title, value, detail }: { title: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{title}</p>
      <p className="mt-2 text-2xl font-black text-[var(--text)]">{value}</p>
      {detail ? <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{detail}</p> : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function BmiCalculator({ locale = "en" }: { locale?: Locale }) {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const bmi = numberValue(weight, 65) / (numberValue(height, 170) / 100) ** 2;
  const category = bmi < 18.5 ? (locale === "zh" ? "偏瘦" : "Underweight") : bmi < 24 ? (locale === "zh" ? "正常" : "Normal") : bmi < 28 ? (locale === "zh" ? "超重" : "Overweight") : (locale === "zh" ? "肥胖" : "Obesity");
  const summary = locale === "zh" ? `BMI ${bmi.toFixed(1)}，分类：${category}` : `BMI ${bmi.toFixed(1)}, category: ${category}`;

  return (
    <ToolPanel label={locale === "zh" ? "BMI 计算器" : "BMI calculator"}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <ToolInput label={locale === "zh" ? "身高 cm" : "Height cm"} value={height} onChange={setHeight} type="number" />
          <ToolInput label={locale === "zh" ? "体重 kg" : "Weight kg"} value={weight} onChange={setWeight} type="number" />
          <ResetButton label={locale === "zh" ? "重置" : "Reset"} onClick={() => { setHeight("170"); setWeight("65"); }} />
        </div>
        <div className="space-y-4">
          <ResultCard title="BMI" value={bmi.toFixed(1)} detail={category} />
          <CopyButton value={summary} label={locale === "zh" ? "复制结果" : "Copy result"} copiedLabel={locale === "zh" ? "已复制" : "Copied"} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function CalorieCalculator({ locale = "en" }: { locale?: Locale }) {
  const [sex, setSex] = useState("female");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("165");
  const [weight, setWeight] = useState("58");
  const [activity, setActivity] = useState("1.375");
  const bmr = 10 * numberValue(weight, 58) + 6.25 * numberValue(height, 165) - 5 * numberValue(age, 30) + (sex === "female" ? -161 : 5);
  const tdee = bmr * numberValue(activity, 1.375);
  const summary = locale === "zh" ? `基础代谢约 ${Math.round(bmr)} kcal/天，维持热量约 ${Math.round(tdee)} kcal/天。` : `BMR about ${Math.round(bmr)} kcal/day, maintenance about ${Math.round(tdee)} kcal/day.`;

  return (
    <ToolPanel label={locale === "zh" ? "卡路里计算器" : "Calorie calculator"}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label={locale === "zh" ? "性别" : "Sex"} value={sex} onChange={setSex} options={[{ value: "female", label: locale === "zh" ? "女" : "Female" }, { value: "male", label: locale === "zh" ? "男" : "Male" }]} />
          <ToolInput label={locale === "zh" ? "年龄" : "Age"} value={age} onChange={setAge} type="number" />
          <ToolInput label={locale === "zh" ? "身高 cm" : "Height cm"} value={height} onChange={setHeight} type="number" />
          <ToolInput label={locale === "zh" ? "体重 kg" : "Weight kg"} value={weight} onChange={setWeight} type="number" />
          <SelectField label={locale === "zh" ? "活动量" : "Activity"} value={activity} onChange={setActivity} options={[
            { value: "1.2", label: locale === "zh" ? "久坐" : "Sedentary" },
            { value: "1.375", label: locale === "zh" ? "轻度活动" : "Light" },
            { value: "1.55", label: locale === "zh" ? "中等活动" : "Moderate" },
            { value: "1.725", label: locale === "zh" ? "高活动" : "Active" },
          ]} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title={locale === "zh" ? "基础代谢" : "BMR"} value={`${Math.round(bmr)} kcal`} />
          <ResultCard title={locale === "zh" ? "维持热量" : "Maintenance"} value={`${Math.round(tdee)} kcal`} />
          <ResultCard title={locale === "zh" ? "减脂参考" : "Fat loss"} value={`${Math.round(tdee - 400)} kcal`} />
          <ResultCard title={locale === "zh" ? "增肌参考" : "Muscle gain"} value={`${Math.round(tdee + 250)} kcal`} />
          <CopyButton value={summary} label={locale === "zh" ? "复制结果" : "Copy result"} copiedLabel={locale === "zh" ? "已复制" : "Copied"} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function SleepCalculator({ locale = "en" }: { locale?: Locale }) {
  const [mode, setMode] = useState("wake");
  const [time, setTime] = useState("07:00");
  const options = useMemo(() => {
    const [hour = 7, minute = 0] = time.split(":").map(Number);
    const base = new Date();
    base.setHours(hour, minute, 0, 0);
    return [6, 5, 4, 3].map((cycles) => {
      const minutes = cycles * 90 + 15;
      const date = mode === "wake" ? new Date(base.getTime() - minutes * 60 * 1000) : new Date(base.getTime() + minutes * 60 * 1000);
      return { cycles, time: date.toTimeString().slice(0, 5) };
    });
  }, [mode, time]);

  return (
    <ToolPanel label={locale === "zh" ? "睡眠计算器" : "Sleep calculator"}>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <SelectField label={locale === "zh" ? "模式" : "Mode"} value={mode} onChange={setMode} options={[{ value: "wake", label: locale === "zh" ? "按起床时间反推" : "Plan by wake time" }, { value: "sleep", label: locale === "zh" ? "从入睡时间推算" : "Plan by bedtime" }]} />
          <ToolInput label={locale === "zh" ? "时间" : "Time"} value={time} onChange={setTime} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <ResultCard key={option.cycles} title={`${option.cycles} ${locale === "zh" ? "个睡眠周期" : "cycles"}`} value={option.time} detail={locale === "zh" ? "已包含约 15 分钟入睡缓冲" : "Includes about 15 minutes to fall asleep"} />
          ))}
        </div>
      </div>
    </ToolPanel>
  );
}

export function FinancialGoalCalculator({ locale = "en" }: { locale?: Locale }) {
  const [target, setTarget] = useState("100000");
  const [current, setCurrent] = useState("10000");
  const [months, setMonths] = useState("36");
  const [rate, setRate] = useState("4");
  const monthlyRate = numberValue(rate, 4) / 100 / 12;
  const monthCount = Math.max(1, numberValue(months, 36));
  const futureCurrent = numberValue(current, 10000) * (1 + monthlyRate) ** monthCount;
  const monthly = monthlyRate === 0 ? (numberValue(target, 100000) - numberValue(current, 10000)) / monthCount : (numberValue(target, 100000) - futureCurrent) * monthlyRate / ((1 + monthlyRate) ** monthCount - 1);

  return (
    <ToolPanel label={locale === "zh" ? "理财目标计算器" : "Financial goal calculator"}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolInput label={locale === "zh" ? "目标金额" : "Target"} value={target} onChange={setTarget} type="number" />
          <ToolInput label={locale === "zh" ? "已有金额" : "Current"} value={current} onChange={setCurrent} type="number" />
          <ToolInput label={locale === "zh" ? "期限（月）" : "Months"} value={months} onChange={setMonths} type="number" />
          <ToolInput label={locale === "zh" ? "年化收益率 %" : "Annual return %"} value={rate} onChange={setRate} type="number" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title={locale === "zh" ? "每月需储蓄" : "Monthly saving"} value={money(monthly, locale)} />
          <ResultCard title={locale === "zh" ? "已有资金预计" : "Projected current"} value={money(futureCurrent, locale)} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function RetirementCalculator({ locale = "en" }: { locale?: Locale }) {
  const [age, setAge] = useState("30");
  const [retireAge, setRetireAge] = useState("60");
  const [current, setCurrent] = useState("100000");
  const [monthly, setMonthly] = useState("3000");
  const [rate, setRate] = useState("5");
  const years = Math.max(0, numberValue(retireAge, 60) - numberValue(age, 30));
  const months = years * 12;
  const monthlyRate = numberValue(rate, 5) / 100 / 12;
  const futureCurrent = numberValue(current, 100000) * (1 + monthlyRate) ** months;
  const futureMonthly = monthlyRate === 0 ? numberValue(monthly, 3000) * months : numberValue(monthly, 3000) * (((1 + monthlyRate) ** months - 1) / monthlyRate);

  return (
    <ToolPanel label={locale === "zh" ? "退休计算器" : "Retirement calculator"}>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolInput label={locale === "zh" ? "当前年龄" : "Current age"} value={age} onChange={setAge} type="number" />
          <ToolInput label={locale === "zh" ? "退休年龄" : "Retirement age"} value={retireAge} onChange={setRetireAge} type="number" />
          <ToolInput label={locale === "zh" ? "已有储蓄" : "Current savings"} value={current} onChange={setCurrent} type="number" />
          <ToolInput label={locale === "zh" ? "每月投入" : "Monthly contribution"} value={monthly} onChange={setMonthly} type="number" />
          <ToolInput label={locale === "zh" ? "年化收益率 %" : "Annual return %"} value={rate} onChange={setRate} type="number" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title={locale === "zh" ? "距离退休" : "Years to retire"} value={`${years}`} detail={locale === "zh" ? "年" : "years"} />
          <ResultCard title={locale === "zh" ? "预计退休储蓄" : "Projected savings"} value={money(futureCurrent + futureMonthly, locale)} />
          <ResultCard title={locale === "zh" ? "已有资金贡献" : "From current"} value={money(futureCurrent, locale)} />
          <ResultCard title={locale === "zh" ? "每月投入贡献" : "From monthly"} value={money(futureMonthly, locale)} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function FiveElementsReference({ locale = "en" }: { locale?: Locale }) {
  const [date, setDate] = useState("1995-08-17");
  const parsed = new Date(date);
  const valid = !Number.isNaN(parsed.getTime());
  const stems = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  const branches = ["Water", "Earth", "Wood", "Wood", "Earth", "Fire", "Fire", "Earth", "Metal", "Metal", "Earth", "Water"];
  const elementZh: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };
  const counts = valid
    ? [stems[(parsed.getFullYear() - 4) % 10], branches[(parsed.getFullYear() - 4) % 12], stems[parsed.getMonth() % stems.length], branches[parsed.getDate() % branches.length]].reduce<Record<string, number>>((acc, item) => {
        acc[item] = (acc[item] ?? 0) + 1;
        return acc;
      }, {})
    : {};
  const strongest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <ToolPanel label={locale === "zh" ? "生日五行参考" : "Five elements reference"}>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <ToolInput label={locale === "zh" ? "出生日期" : "Birth date"} value={date} onChange={setDate} />
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            {locale === "zh" ? "这是基于公历日期的轻量参考，不等同于完整八字排盘。" : "This is a lightweight date-based reference, not a full BaZi chart."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Wood", "Fire", "Earth", "Metal", "Water"].map((element) => (
            <ResultCard key={element} title={locale === "zh" ? elementZh[element] : element} value={`${counts[element] ?? 0}`} />
          ))}
          <ResultCard title={locale === "zh" ? "较强元素" : "Strongest"} value={strongest ? (locale === "zh" ? elementZh[strongest] : strongest) : "-"} detail={locale === "zh" ? "仅供自我观察参考" : "For reflection only"} />
        </div>
      </div>
    </ToolPanel>
  );
}
