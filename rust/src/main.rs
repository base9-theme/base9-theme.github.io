use palette::Srgb;
use std::{
    collections::HashMap,
    env,
};
use mustache::{Data, compile_path, to_data};

const N: usize = 11;
type Rgb = Srgb<u8>;
type Colors = [Rgb;N];

fn main() {
    let args: Vec<String> = env::args().collect();
    let color_str = args.get(2).unwrap();
    let cs: Colors = color_str.split('-').map(|s| {
        let r = u8::from_str_radix(&s[0..2], 16).unwrap();
        let g = u8::from_str_radix(&s[2..4], 16).unwrap();
        let b = u8::from_str_radix(&s[4..6], 16).unwrap();
        return Srgb::from_components((r,g,b));
    }).collect::<Vec<Rgb>>().try_into().unwrap();
    
    let named_colors = get_named_colors(&cs);
    let data = get_template_variables(named_colors);
    compile_path(args.get(1).unwrap()).unwrap().render_data(&mut std::io::stdout(), &data).unwrap();
    // let output = compile_path(args.get(1).unwrap()).unwrap().render_data_to_string(&data).unwrap();
    // file.write(output.as_bytes()).unwrap();
}
fn mix1d(a: u8, b: u8, w: f32) -> u8 {
    return ((a as f32)*(1.-w)+(b as f32)*w).ceil() as u8;
}
fn mix(c1: Rgb, c2: Rgb, w: f32) -> Rgb {
    return Rgb::from_components((
        mix1d(c1.red, c2.red, w),
        mix1d(c1.green, c2.green, w),
        mix1d(c1.blue, c2.blue, w)));
}
fn get_template_variables(cs: [(&str, Rgb); 59]) -> Data {
    let hash_map: HashMap<String, String> = HashMap::from_iter(cs.iter().flat_map(|(k, v)| {
        return [
            (k.to_string()+"_hex", format!("{:02x?}{:02x?}{:02x?}",v.red, v.green, v.blue)),
        ];
    }));
    return to_data(hash_map).unwrap();
}

fn get_named_colors(cs: &Colors) -> [(&str, Rgb); 59] {
    let cs2 = [cs[4],cs[6],cs[7],cs[8],cs[9],cs[10]];
    let r1 = 0.5;
    let r2 = 0.25;
    return [
        ("bg_d", cs[0]),
        ("bg_s", cs[0]),
        ("bg", cs[1]),
        ("c0_d", mix(cs[2 ], cs[1], 1. - r2)), ("c0_s", mix(cs[2 ], cs[1], r2)), ("c0", cs[2 ]), ("c0_h", cs[3 ]),
        ("c1_d", mix(cs[4 ], cs[1], 1. - r2)), ("c1_s", mix(cs[4 ], cs[1], r2)), ("c1", cs[4 ]), ("c1_h", mix(cs[4 ], cs[3], r1)),
        ("c2_d", mix(cs[5 ], cs[1], 1. - r2)), ("c2_s", mix(cs[5 ], cs[1], r2)), ("c2", cs[5 ]), ("c2_h", mix(cs[5 ], cs[3], r1)),
        ("c3_d", mix(cs[6 ], cs[1], 1. - r2)), ("c3_s", mix(cs[6 ], cs[1], r2)), ("c3", cs[6 ]), ("c3_h", mix(cs[6 ], cs[3], r1)),
        ("c4_d", mix(cs[7 ], cs[1], 1. - r2)), ("c4_s", mix(cs[7 ], cs[1], r2)), ("c4", cs[7 ]), ("c4_h", mix(cs[7 ], cs[3], r1)),
        ("c5_d", mix(cs[8 ], cs[1], 1. - r2)), ("c5_s", mix(cs[8 ], cs[1], r2)), ("c5", cs[8 ]), ("c5_h", mix(cs[8 ], cs[3], r1)),
        ("c6_d", mix(cs[9 ], cs[1], 1. - r2)), ("c6_s", mix(cs[9 ], cs[1], r2)), ("c6", cs[9 ]), ("c6_h", mix(cs[9 ], cs[3], r1)),
        ("c7_d", mix(cs[10], cs[1], 1. - r2)), ("c7_s", mix(cs[10], cs[1], r2)), ("c7", cs[10]), ("c7_h", mix(cs[10], cs[3], r1)),
        ("cr_d", mix(cs2[0], cs[1], 1. - r2)), ("cr_s", mix(cs2[0], cs[1], r2)), ("cr", cs2[0]), ("cr_h", mix(cs2[0], cs[3], r1)),
        ("cy_d", mix(cs2[1], cs[1], 1. - r2)), ("cy_s", mix(cs2[1], cs[1], r2)), ("cy", cs2[1]), ("cy_h", mix(cs2[1], cs[3], r1)),
        ("cg_d", mix(cs2[2], cs[1], 1. - r2)), ("cg_s", mix(cs2[2], cs[1], r2)), ("cg", cs2[2]), ("cg_h", mix(cs2[2], cs[3], r1)),
        ("cc_d", mix(cs2[3], cs[1], 1. - r2)), ("cc_s", mix(cs2[3], cs[1], r2)), ("cc", cs2[3]), ("cc_h", mix(cs2[3], cs[3], r1)),
        ("cb_d", mix(cs2[4], cs[1], 1. - r2)), ("cb_s", mix(cs2[4], cs[1], r2)), ("cb", cs2[4]), ("cb_h", mix(cs2[4], cs[3], r1)),
        ("cm_d", mix(cs2[5], cs[1], 1. - r2)), ("cm_s", mix(cs2[5], cs[1], r2)), ("cm", cs2[5]), ("cm_h", mix(cs2[5], cs[3], r1)), 
    ];
}
