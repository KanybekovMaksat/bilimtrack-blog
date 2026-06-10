import type { ArticleCategory } from "@/entities/category";

import type { CoverScene } from "../model/types";

/**
 * Styled placeholder cover markup (abstract product mocks), ported verbatim
 * from the design prototype. Returned as an HTML string and rendered via
 * `dangerouslySetInnerHTML` — these are trusted, build-time constants.
 *
 * Swap each scene for a real 16:9 screenshot when production art is ready.
 */
export function coverHtml(args: {
  cat: ArticleCategory;
  cover: CoverScene;
}): string {
  const grad = "cover--" + args.cat;

  const scenes: Record<CoverScene, string> = {
    journal: `
      <div class="mock" style="width:74%;">
        <div class="mock__row"><div class="mock__bar" style="width:34%"></div><div style="flex:1"></div><div class="mock__pill g5">5</div><div class="mock__pill g4">4</div></div>
        <div class="mock__row"><div class="mock__bar" style="width:52%"></div><div style="flex:1"></div><div class="mock__pill g4">4</div><div class="mock__pill g3">3</div></div>
        <div class="mock__row"><div class="mock__bar" style="width:28%"></div><div style="flex:1"></div><div class="mock__pill g5">5</div><div class="mock__pill g5">5</div></div>
      </div>`,
    schedule: `
      <div class="mock" style="width:72%;gap:9px;">
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#155dfc"></div></div>
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#eef4ff"></div></div>
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#51a2ff"></div></div>
      </div>`,
    rating: `
      <div class="mock" style="width:72%;gap:11px;">
        <div class="mock__row"><div class="mock__pill" style="background:#ff8904">1</div><div class="mock__bar" style="flex:1;height:10px;background:#ffe6cf"></div></div>
        <div class="mock__row"><div class="mock__pill" style="background:#ad46ff">2</div><div class="mock__bar" style="width:78%;height:10px;background:#f0e2fd"></div></div>
        <div class="mock__row"><div class="mock__pill" style="background:#a1a1a1">3</div><div class="mock__bar" style="width:58%;height:10px;background:#eef0f3"></div></div>
      </div>`,
    chat: `
      <div style="width:74%;display:flex;flex-direction:column;gap:9px;">
        <div style="align-self:flex-start;background:#fff;border-radius:14px 14px 14px 4px;box-shadow:0 12px 28px -16px rgba(15,30,60,.3);padding:11px 13px;width:64%"><div class="mock__bar" style="width:90%"></div><div class="mock__bar" style="width:60%;margin-top:6px"></div></div>
        <div style="align-self:flex-end;background:#155dfc;border-radius:14px 14px 4px 14px;padding:11px 13px;width:52%"><div style="height:8px;border-radius:9999px;background:rgba(255,255,255,.85);width:80%"></div><div style="height:8px;border-radius:9999px;background:rgba(255,255,255,.55);width:50%;margin-top:6px"></div></div>
      </div>`,
    stats: `
      <div class="mock" style="width:72%;flex-direction:row;align-items:center;gap:16px;">
        <svg width="62" height="62" viewBox="0 0 62 62" style="flex:none">
          <circle cx="31" cy="31" r="26" fill="none" stroke="#eef0f3" stroke-width="9"/>
          <circle cx="31" cy="31" r="26" fill="none" stroke="#155dfc" stroke-width="9" stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="48" transform="rotate(-90 31 31)"/>
        </svg>
        <div style="flex:1;display:flex;flex-direction:column;gap:9px">
          <div class="mock__bar" style="width:90%;height:9px"></div>
          <div class="mock__bar" style="width:64%;height:9px"></div>
          <div class="mock__bar" style="width:78%;height:9px"></div>
        </div>
      </div>`,
    news: `
      <div class="mock" style="width:70%;gap:0;padding:0;overflow:hidden;">
        <div style="height:38px;background:linear-gradient(135deg,#ff8904,#ff6900)"></div>
        <div style="padding:13px;display:flex;flex-direction:column;gap:8px">
          <div class="mock__bar" style="width:86%"></div>
          <div class="mock__bar" style="width:58%"></div>
          <div style="display:flex;gap:6px;margin-top:4px"><div style="width:34px;height:16px;border-radius:9999px;background:#fff7ed"></div><div style="width:34px;height:16px;border-radius:9999px;background:#eff6ff"></div></div>
        </div>
      </div>`,
    brand: `
      <div class="cover__watermark" style="left:26px;top:22px;font-size:40px;color:rgba(255,255,255,.92)">Bilimtrack</div>
      <div class="cover__watermark" style="left:28px;top:74px;font-size:15px;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:0">Образовательная экосистема</div>
      <img src="/mascot-panda.png" alt="" style="position:absolute;right:-6px;bottom:-10px;width:46%;max-width:200px;filter:drop-shadow(0 16px 30px rgba(0,0,0,.35))">`,
  };

  return `<div class="cover ${grad}"><div class="cover__chrome">${scenes[args.cover]}</div></div>`;
}
