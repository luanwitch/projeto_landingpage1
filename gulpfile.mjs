import gulp from "gulp";
import * as sass from "sass";  // Mantém a alteração
import gulpSass from "gulp-sass";
import uglify from "gulp-uglify";
import cleanCSS from "gulp-clean-css";
import { deleteAsync } from "del";

// Agora associamos o gulpSass com o sass corretamente
const sassCompiler = gulpSass(sass);

// Função para limpar a pasta public
async function clean() {
    await deleteAsync(["./public/**", "!./public"]);
}

// Função para compilar o SASS para CSS
function styles() {
    return gulp.src("src/styles/**/*.scss")
        .pipe(sassCompiler({ outputStyle: "compressed" }).on("error", function (err) { // Modificação aqui
            console.error(err.message); // Exibe a mensagem de erro no console
            this.emit('end'); // Continua a execução, mas emite o erro
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./public/css/"));
}

// Função para minificar os arquivos JavaScript
function scripts() {
    return gulp.src("src/scripts/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/"));
}

// Função para observar alterações nos arquivos
function watch() {
    gulp.watch("src/styles/**/*.scss", styles);
    gulp.watch("src/scripts/**/*.js", scripts);
}

export { clean, styles, scripts, watch };
export default gulp.series(clean, gulp.parallel(styles, scripts));
