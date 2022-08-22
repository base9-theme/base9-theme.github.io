<template>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;{ computed, ref } </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;vue&quot;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;</span><span class="c9">type</span><span class="c1">&nbsp;{ Ref, WritableComputedRef, InjectionKey } </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;vue&quot;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;{ I9, N9 } </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;./helpers&quot;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;Color </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;color&quot;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;_ </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;lodash&quot;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">import</span><span class="c1">&nbsp;{ getData } </span><span class="c9">from</span><span class="c1">&nbsp;</span><span class="c4">&quot;base9-builder&quot;</span><span class="c1 c2">;</span></p>
<p class="c0 c10"><span class="c1 c2"></span></p>
<p class="c0"><span class="c9">export</span><span class="c1">&nbsp;</span><span class="c9">const</span><span class="c1">&nbsp;DEFAULT_PALETTE </span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c4">&#39;16161D-E0E5C8-CEAA7A-A6B2C1-CBA8B3-93BC95-DBA595-8AB9B2-B0B47A&#39;</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">export</span><span class="c1">&nbsp;</span><span class="c9">const</span><span class="c1">&nbsp;PALETTE_REGEX </span><span class="c7">=</span><span class="c4">&nbsp;/</span><span class="c9">^</span><span class="c8">(</span><span class="c1">[</span><span class="c6">0-9a-fA-F</span><span class="c1">]</span><span class="c7">{6}</span><span class="c4">-</span><span class="c8">)</span><span class="c7">{8}</span><span class="c1">[</span><span class="c6">0-9a-fA-F</span><span class="c1">]</span><span class="c7">{6}</span><span class="c9">$</span><span class="c4">/</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c9">export</span><span class="c1">&nbsp;</span><span class="c9">const</span><span class="c1">&nbsp;palette_key </span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c3">Symbol</span><span class="c1">() </span><span class="c9">as</span><span class="c1">&nbsp;</span><span class="c8">InjectionKey</span><span class="c1">&lt;</span><span class="c8">Palette</span><span class="c1 c2">&gt;</span></p>
<p class="c0 c10"><span class="c1 c2"></span></p>
<p class="c0"><span class="c9">export</span><span class="c1">&nbsp;</span><span class="c9">class</span><span class="c1">&nbsp;</span><span class="c8">Palette</span><span class="c1 c2">&nbsp;{</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c6">palette</span><span class="c7">:</span><span class="c1">&nbsp;</span><span class="c8">Ref</span><span class="c1">&lt;</span><span class="c8">string</span><span class="c1 c2">&gt;;</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c6">hexs</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;_.</span><span class="c3">times</span><span class="c1">(N9, </span><span class="c5">i</span><span class="c1">&nbsp;</span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c3">computed</span><span class="c1 c2">({</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp;</span><span class="c3">get</span><span class="c1">: () </span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">.</span><span class="c6">value</span><span class="c1">.</span><span class="c3">substring</span><span class="c1">(</span><span class="c5">i</span><span class="c7">*</span><span class="c3">7</span><span class="c1">, </span><span class="c5">i</span><span class="c7">*</span><span class="c3">7</span><span class="c7">+</span><span class="c3">6</span><span class="c1 c2">),</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp;</span><span class="c3">set</span><span class="c1">: (</span><span class="c5">c</span><span class="c7">:</span><span class="c1">&nbsp;</span><span class="c8">string</span><span class="c1">) </span><span class="c8">=&gt;</span><span class="c1 c2">&nbsp;{</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">const</span><span class="c1">&nbsp;start </span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c5">i</span><span class="c7">*</span><span class="c3">7</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">const</span><span class="c1">&nbsp;end </span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c5">i</span><span class="c7">*</span><span class="c3">7</span><span class="c7">+</span><span class="c3">6</span><span class="c1 c2">;</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">.</span><span class="c6">value</span><span class="c1">&nbsp;</span><span class="c7 c2">=</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">.</span><span class="c6">value</span><span class="c1">.</span><span class="c3">substring</span><span class="c1">(</span><span class="c3">0</span><span class="c1">,start) </span><span class="c7 c2">+</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c5">c</span><span class="c1">&nbsp;</span><span class="c7 c2">+</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">.</span><span class="c6">value</span><span class="c1">.</span><span class="c3">substring</span><span class="c1 c2">(end);</span></p>
<p class="c0"><span class="c1 c2">&nbsp; &nbsp; &nbsp;}</span></p>
<p class="c0"><span class="c1 c2">&nbsp; &nbsp;}));</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c6">colors</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;_.</span><span class="c3">times</span><span class="c1">(N9, </span><span class="c5">i</span><span class="c1">&nbsp;</span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c3">computed</span><span class="c1 c2">({</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp;</span><span class="c3">get</span><span class="c1">: () </span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c8">Color</span><span class="c1">(</span><span class="c4">&quot;#&quot;</span><span class="c7">+</span><span class="c9">this</span><span class="c1">.</span><span class="c6">hexs</span><span class="c1">[</span><span class="c5">i</span><span class="c1">].</span><span class="c6">value</span><span class="c1 c2">),</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp;</span><span class="c3">set</span><span class="c1">: (</span><span class="c5">c</span><span class="c7">:</span><span class="c1">&nbsp;</span><span class="c8">Color</span><span class="c1">) </span><span class="c8">=&gt;</span><span class="c1 c2">&nbsp;{</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp; &nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">hexs</span><span class="c1">[</span><span class="c5">i</span><span class="c1">].</span><span class="c6">value</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c5">c</span><span class="c1">.</span><span class="c3">hex</span><span class="c1">().</span><span class="c3">substring</span><span class="c1">(</span><span class="c3">1</span><span class="c1 c2">);</span></p>
<p class="c0"><span class="c1 c2">&nbsp; &nbsp; &nbsp;}</span></p>
<p class="c0"><span class="c1 c2">&nbsp; &nbsp;}));</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c6">colorData</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c3">computed</span><span class="c1">(() </span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c3">getData</span><span class="c1">(</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">.</span><span class="c6">value</span><span class="c1 c2">));</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c6">dark</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c3">computed</span><span class="c1">(() </span><span class="c8">=&gt;</span><span class="c1">&nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">colors</span><span class="c1">[</span><span class="c3">0</span><span class="c1">].</span><span class="c6">value</span><span class="c1">.</span><span class="c3">l</span><span class="c1">() </span><span class="c7">&lt;</span><span class="c1">&nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">colors</span><span class="c1">[</span><span class="c3">1</span><span class="c1">].</span><span class="c6">value</span><span class="c1">.</span><span class="c3">l</span><span class="c1 c2">());</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp;</span><span class="c9">constructor</span><span class="c1">(</span><span class="c5">palette</span><span class="c7">:</span><span class="c1">&nbsp;</span><span class="c8">string</span><span class="c1 c2">) {</span></p>
<p class="c0"><span class="c1">&nbsp; &nbsp; &nbsp;</span><span class="c9">this</span><span class="c1">.</span><span class="c6">palette</span><span class="c1">&nbsp;</span><span class="c7">=</span><span class="c1">&nbsp;</span><span class="c3">ref</span><span class="c1">(</span><span class="c5">palette</span><span class="c1 c2">);</span></p>
<p class="c0"><span class="c1 c2">&nbsp; &nbsp;}</span></p>
<p class="c0"><span class="c1">}</span></p>
<p class="c10 c11"><span class="c2 c13"></span></p>
</template>
<style scoped>
@import url('https://themes.googleusercontent.com/fonts/css?kit=sDU-RIIs3Wq_4pUcDwWu-05zdwzqyXAFhQ3EpAK6bTA');
ol{
    margin:0;
    padding:0
}
table td,table th{
    padding:0
}
.c0{
    background-color: var(--base9-background);
    padding-top:0pt;
    padding-bottom:0pt;
    line-height:1.3571428571428572;
    orphans:2;
    widows:2;
    text-align:left
}
.c11{
    padding-top:0pt;
    padding-bottom:0pt;
    line-height:1.0;
    orphans:2;
    widows:2;
    text-align:left
}
.c8{
    font-size:10.5pt;
    font-family:"Courier New";
    color:var(--base9-c1-p100);
    font-weight:400
}
.c13{
    color:#000000;
    font-weight:400;
    font-size:12pt;
    font-family:"Cambria"
}
.c7{
    font-size:10.5pt;
    font-family:"Courier New";
    color: var(--base9-c6-p100);
    font-weight:400
}
.c1{
    font-size:10.5pt;
    font-family:"Courier New";
    color:var(--base9-foreground-p100);
    font-weight:400
}
.c9{
    font-size:10.5pt;
    font-family:"Courier New";
    color:var(--base9-c7-p100);
    font-weight:400
}
.c4{
    font-size:10.5pt;
    font-family:"Courier New";
    color: var(--base9-c3-p100);
    font-weight:400
}
.c6{
    font-size:10.5pt;
    font-family:"Courier New";
    color: var(--base9-c2-p100);
    font-weight:400
}
.c5{
    font-size:10.5pt;
    font-family:"Courier New";
    color: var(--base9-c5-p100);
    font-weight:400
}
.c3{
    font-size:10.5pt;
    font-family:"Courier New";
    color: var(--base9-c4-p100);
    font-weight:400
}
.c12 {
    background-color:#ffffff;
    max-width:468pt;
    padding:72pt 72pt 72pt 72pt
}
.c2{
    text-decoration:none;
    vertical-align:baseline;
    font-style:normal
}
.c10{
    height:12pt
}
.title{
    padding-top:24pt;
    color:#000000;
    font-weight:700;
    font-size:36pt;
    padding-bottom:6pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
.subtitle{
    padding-top:18pt;
    color:#666666;
    font-size:24pt;
    padding-bottom:4pt;
    font-family:"Georgia";
    line-height:1.0;
    page-break-after:avoid;
    font-style:italic;
    orphans:2;
    widows:2;
    text-align:left
}
li{
    color:#000000;
    font-size:12pt;
    font-family:"Cambria"
}
p{
    margin:0;
    color:#000000;
    font-size:12pt;
    font-family:"Cambria"
}
h1{
    padding-top:24pt;
    color:#000000;
    font-weight:700;
    font-size:24pt;
    padding-bottom:6pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
h2{
    padding-top:18pt;
    color:#000000;
    font-weight:700;
    font-size:18pt;
    padding-bottom:4pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
h3{
    padding-top:14pt;
    color:#000000;
    font-weight:700;
    font-size:14pt;
    padding-bottom:4pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
h4{
    padding-top:12pt;
    color:#000000;
    font-weight:700;
    font-size:12pt;
    padding-bottom:2pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
h5{
    padding-top:11pt;
    color:#000000;
    font-weight:700;
    font-size:11pt;
    padding-bottom:2pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
h6{
    padding-top:10pt;
    color:#000000;
    font-weight:700;
    font-size:10pt;
    padding-bottom:2pt;
    font-family:"Cambria";
    line-height:1.0;
    page-break-after:avoid;
    orphans:2;
    widows:2;
    text-align:left
}
</style>

<script setup lang="ts">
</script>
