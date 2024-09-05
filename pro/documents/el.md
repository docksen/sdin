# sdin

- [sdin](#sdin)
  - [Παράδειγμα](#παράδειγμα)
  - [Ρύθμιση](#ρύθμιση)
    - [SdinConfigParams](#sdinconfigparams)
    - [SdinDeclarationModuleParams](#sdindeclarationmoduleparams)
    - [SdinFoundationModuleParams](#sdinfoundationmoduleparams)
    - [SdinIntegrationModuleParams](#sdinintegrationmoduleparams)
  - [Εντολή](#εντολή)
    - [Κύρια εντολή](#κύρια-εντολή)
    - [`build` Εντολή](#build-εντολή)
    - [`create` Εντολή](#create-εντολή)
  - [Διασύνδεση](#διασύνδεση)
    - [readSdinConfig](#readsdinconfig)
    - [createSdinProject](#createsdinproject)
    - [buildSdinProject](#buildsdinproject)

## Παράδειγμα

Κατασκευή έργου στη γραμμή εντολών:

```shell
$ sdin build
i Project hello, version 0.0.1.
i Project files are qualified, checking took 0.003 s.
√ Successfully built foundation cjs module camille, it took 0.32 s.
√ Successfully built foundation esm module elise, it took 0.06 s.
√ Successfully built declaration dts module diana, it took 1.361 s.
√ Successfully built integration umd module urgoth, it took 12.173 s.
i Webpack compiled information: ...
```

Κατασκευή έργου σε κώδικα:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Ρύθμιση

Η διαδρομή αρχείου ρύθμισης παραμέτρων για το έργο: `pro/configs/project.ts`。

Το περιεχόμενο του αρχείου ρυθμίσεων του έργου:

```typescript
import { SdinConfigParams } from 'sdin'
export const sdinConfigParams: SdinConfigParams = {...}
```

### SdinConfigParams

Ρύθμιση έργου

| Χαρακτηριστικό | Τύπος                       | Απαιτείται | Προκαθορισμένο          | Περιγραφή                                                                  | Παράδειγμα            |
| -------------- | --------------------------- | ---------- | ----------------------- | -------------------------------------------------------------------------- | --------------------- |
| root           | string                      | Όχι        | Τρέχουσα λίστα εργασίας | Κατάλογος ρίζας έργου                                                      | -                     |
| mode           | SdinBuildMode               | Όχι        | production              | Σχέδιο δόμησης                                                             | -                     |
| alias          | Record\<string, string\>    | Όχι        | -                       | Όνομα ενότητας，\<Alias, Διαδρομή (σχετικά με τον ριζικό κατάλογο έργου)\> | {utils: "src/utils" } |
| definitions    | Record<string, string>      | Όχι        | -                       | Συνολικός ορισμός，\<Αρχικός κωδικός, Αντικατάσταση κωδικού\>              | -                     |
| modules        | OrNil\<SdinModuleParams\>[] | Όχι        | -                       | Λίστα στοιχείων ρύθμισης ενότητας                                          | -                     |

```typescript
// production: Τρόπος παραγωγής; development: Αναπτυξιακό περιβάλλον;
type SdinBuildMode = 'development' | 'production'
type OrNil<T> = T | undefined | null
type SdinModuleParams =
  | SdinDeclarationModuleParams
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
```

Το πρόγραμμα έχει παράσχει μερικούς παγκόσμιους ορισμούς για το έργο, οι οποίοι μπορούν να χρησιμοποιηθούν απευθείας στο έργο:

```typescript
declare global {
  const SDIN_PROJECT_MODE: string // Ο τρόπος κατασκευής του έργου
  const SDIN_PROJECT_NAME: string // Όνομα έργου
  const SDIN_PROJECT_VERSION: string // Έκδοση έργου
  const SDIN_PROJECT_AUTHOR_NAME: string // Όνομα συγγραφέα έργου
  const SDIN_PROJECT_AUTHOR_EMAIL: string // Ηλεκτρονικό μήνυμα συντάκτη έργου
  const SDIN_MODULE_TYPE: string // Κατά τη σύνταξη, ο τύπος της ενότητας
  const SDIN_MODULE_MODE: string // Ο τρόπος κατασκευής των ενοτήτων κατά τη σύνταξη
  const SDIN_MODULE_NAME: string // Όνομα ενότητας κατά τη σύνταξη
}
```

### SdinDeclarationModuleParams

Ορισμός ρυθμίσεων μονάδας

| Χαρακτηριστικό | Τύπος                     | Απαιτείται | Προκαθορισμένο                   | Περιγραφή                                                                 | Παράδειγμα |
| -------------- | ------------------------- | ---------- | -------------------------------- | ------------------------------------------------------------------------- | ---------- |
| type           | 'declaration'             | Ναι        | -                                | Τύπος ενότητας                                                            | -          |
| mode           | SdinDeclarationModuleMode | Όχι        | 'dts'                            | Τρόπος κατασκευής ενότητας                                                | -          |
| name           | string                    | Ναι        | -                                | Όνομα ενότητας                                                            | -          |
| src            | string                    | Όχι        | 'src'                            | Η θέση του πηγαίου κώδικα εισόδου (σε σχέση με τον ριζικό κατάλογο έργου) | -          |
| tar            | string                    | Όχι        | 'tar/Τρόπος κατασκευής ενότητας' | Τοποθεσία προορισμού εξόδου (σε σχέση με τον ριζικό κατάλογο έργου)       | -          |
| includes       | OrNil\<string\>[]         | Όχι        | -                                | Περιέχει αρχεία (σχετικά με τον ριζικό κατάλογο έργου)                    | -          |
| excludes       | OrNil\<string\>[]         | Όχι        | -                                | Αποκλεισμένα αρχεία (σχετικά με τον ριζικό κατάλογο έργου)                | -          |

```typescript
// dts: Τύπος Script Definition Module;
type SdinnDeclarationModuleMode = 'dts'
type OrNil<T> = T | undefined | null
```

### SdinFoundationModuleParams

Βασική διαμόρφωση ενότητας

| Χαρακτηριστικό | Τύπος                    | Απαιτείται | Προκαθορισμένο                                  | Περιγραφή                                                                 | Παράδειγμα |
| -------------- | ------------------------ | ---------- | ----------------------------------------------- | ------------------------------------------------------------------------- | ---------- |
| type           | 'foundation'             | Ναι        | -                                               | Τύπος ενότητας                                                            | -          |
| mode           | SdinFoundationModuleMode | Όχι        | 'cjs'                                           | Τρόπος κατασκευής ενότητας                                                | -          |
| name           | string                   | Ναι        | -                                               | Όνομα ενότητας                                                            | -          |
| src            | string                   | Όχι        | 'src'                                           | Η θέση του πηγαίου κώδικα εισόδου (σε σχέση με τον ριζικό κατάλογο έργου) | -          |
| tar            | string                   | Όχι        | 'tar/Τρόπος κατασκευής ενότητας'                | Τοποθεσία προορισμού εξόδου (σε σχέση με τον ριζικό κατάλογο έργου)       | -          |
| includes       | OrNil\<string\>[]        | Όχι        | -                                               | Περιέχει αρχεία (σχετικά με τον ριζικό κατάλογο έργου)                    | -          |
| excludes       | OrNil\<string\>[]        | Όχι        | -                                               | Αποκλεισμένα αρχεία (σχετικά με τον ριζικό κατάλογο έργου)                | -          |
| minify         | boolean                  | Όχι        | Ενεργοποίηση σε κατάσταση παραγωγής             | Συμπίεση κώδικα                                                           | -          |
| uglify         | boolean                  | Όχι        | Ενεργοποίηση σε κατάσταση παραγωγής             | Άσχημος κώδικας (έγκυρος όταν είναι ενεργοποιημένη η ελαχιστοποίηση)      | -          |
| sassModule     | boolean                  | Όχι        | true                                            | Διακόπτης μονάδας SASS                                                    | -          |
| styleImports   | boolean                  | Όχι        | Άνοιγμα όταν είναι ενεργοποιημένη η μονάδα SASS | Εισαγωγή μετατρεπόμενων αρχείων CSS σε αρχεία JS                          | -          |

```typescript
// cjs: Ενότητα κοινής JS; esm: Ενότητα ESModule;
type SdinFoundationModuleMode = 'cjs' | 'esm'
type OrNil<T> = T | undefined | null
```

### SdinIntegrationModuleParams

Διαμόρφωση ολοκληρωμένης μονάδας

| Χαρακτηριστικό | Τύπος                       | Απαιτείται                               | Προκαθορισμένο                      | Περιγραφή                                                                                         | Παράδειγμα |
| -------------- | --------------------------- | ---------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
| type           | 'integration'               | Ναι                                      | -                                   | Τύπος ενότητας                                                                                    | -          |
| mode           | SdinIntegrationModuleMode   | Όχι                                      | 'umd'                               | Τρόπος κατασκευής ενότητας                                                                        | -          |
| name           | string                      | Ναι                                      | -                                   | Όνομα ενότητας                                                                                    | -          |
| src            | string                      | Όχι                                      | 'src/index.{jsx?\|tsx?}'            | Η θέση του πηγαίου κώδικα εισόδου (σε σχέση με τον ριζικό κατάλογο έργου)                         | -          |
| tar            | string                      | Όχι                                      | 'tar/Τρόπος κατασκευής ενότητας'    | Τοποθεσία προορισμού εξόδου (σε σχέση με τον ριζικό κατάλογο έργου)                               | -          |
| entryName      | string                      | Όχι                                      | 'index'                             | Όνομα εισόδου μονάδας                                                                             | -          |
| globalName     | string                      | Η αποτελεσματικότητα πρέπει να μεταδοθεί | -                                   | Καθορίστε το καθολικό όνομα του αντικειμένου εξαγωγής πακέτου (ισχύει σε λειτουργίες cjs και umd) | "React"    |
| minify         | boolean                     | Όχι                                      | Ενεργοποίηση σε κατάσταση παραγωγής | Συμπίεση κώδικα                                                                                   | -          |
| uglify         | boolean                     | Όχι                                      | Ενεργοποίηση σε κατάσταση παραγωγής | Άσχημος κώδικας (έγκυρος όταν είναι ενεργοποιημένη η ελαχιστοποίηση)                              | -          |
| externals      | Record\<string, string\>    | Όχι                                      | -                                   | Κατάργηση εξωτερικών μονάδων που χρησιμοποιούνται στον κώδικα                                     | -          |
| sassModule     | boolean                     | Όχι                                      | true                                | Διακόπτης μονάδας SASS                                                                            | -          |
| babelIncludes  | OrNil\<RuleSetCondition\>[] | Όχι                                      | -                                   | Η συλλογή Babel περιλαμβάνει στοιχεία                                                             | -          |
| babelExcludes  | OrNil\<RuleSetCondition\>[] | Όχι                                      | -                                   | Αντικείμενο αποκλεισμού από τη σύνταξη Babel                                                      | -          |
| rawRule        | Partial\<RuleSetRule\>      | Όχι                                      | -                                   | Τροποποίηση κανόνων συσκευασίας κειμένου                                                          | -          |
| fontRule       | Partial\<RuleSetRule\>      | Όχι                                      | -                                   | Τροποποίηση κανόνων συσκευασίας γραμματοσειράς                                                    | -          |
| imageRule      | Partial\<RuleSetRule\>      | Όχι                                      | -                                   | Τροποποίηση των κανόνων συσκευασίας εικόνας                                                       | -          |
| audioRule      | Partial\<RuleSetRule\>      | Όχι                                      | -                                   | Τροποποίηση κανόνων συσκευασίας ήχου                                                              | -          |
| videoRule      | Partial\<RuleSetRule\>      | Όχι                                      | -                                   | Τροποποίηση κανόνων συσκευασίας βίντεο                                                            | -          |
| rules          | OrNil\<RuleSetRule\>[]      | Όχι                                      | -                                   | Προσθήκη κανόνων συσκευασίας (μπορεί να παρακάμψει ορισμένους προεπιλεγμένους κανόνες)            | -          |

```typescript
// cjs: Ενότητα κοινής JS; glb: Συνολική ενότητα; umd: Ενότητα UMD;
type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'
type OrNil<T> = T | undefined | null
// Για λεπτομέρειες, ανατρέξτε στην: https://webpack.js.org/configuration/module/#rule
type RuleSetCondition = Webpack.RuleSetCondition
// Για λεπτομέρειες, ανατρέξτε στην: https://webpack.js.org/configuration/module/#rule
type RuleSetRule = Webpack.RuleSetRule
```

Εάν τροποποιηθούν οι κανόνες συσκευασίας, όλα τα πεδία εκτός από τον τύπο και τη γεννήτρια. το όνομα του αρχείου" μπορεί να τροποποιηθεί.

Εάν προσθέσετε κανόνες συσκευασίας, μπορείτε να παρακάμψετε τους κανόνες συσκευασίας για κείμενο, γραμματοσειρές, εικόνες, ήχο και βίντεο.

## Εντολή

### Κύρια εντολή

| Επιλογή   | Συντόμευση | Τύπος | Απαιτείται | Προκαθορισμένο | Περιγραφή                 | Παράδειγμα |
| --------- | ---------- | ----- | ---------- | -------------- | ------------------------- | ---------- |
| --version | -v         | -     | -          | -              | Προβολή έκδοσης           | sdin -v    |
| --help    | -h         | -     | -          | -              | Προβολή εγγράφου βοήθειας | sdin -h    |

### `build` Εντολή

Χρησιμοποιείται για οικοδομικά έργα

| Παράμετρος | Γονικό επίπεδο | Τύπος  | Απαιτείται | Προκαθορισμένο          | Περιγραφή                                                    | Παράδειγμα    |
| ---------- | -------------- | ------ | ---------- | ----------------------- | ------------------------------------------------------------ | ------------- |
| path       | -              | string | Όχι        | Τρέχουσα λίστα εργασίας | Καθορίστε τον ριζικό κατάλογο του έργου που θα κατασκευαστεί | sdin build ./ |

| Επιλογή   | Συντόμευση | Τύπος  | Απαιτείται | Προκαθορισμένο   | Περιγραφή                                                                                             | Παράδειγμα                |
| --------- | ---------- | ------ | ---------- | ---------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
| --modules | -m         | string | Όχι        | Όλες οι ενότητες | Καθορίστε τα ονόματα ενοτήτων που θα κατασκευαστούν, με πολλαπλά στοιχεία να διαχωρίζονται με κόμματα | sdin build -m diana,elise |

### `create` Εντολή

Χρησιμοποιείται για τη δημιουργία έργων

| Παράμετρος | Γονικό επίπεδο | Τύπος  | Απαιτείται | Προκαθορισμένο | Περιγραφή                                                                  | Παράδειγμα              |
| ---------- | -------------- | ------ | ---------- | -------------- | -------------------------------------------------------------------------- | ----------------------- |
| name       | -              | string | Όχι        | -              | Καθορίστε το όνομα του πακέτου χρησιμοποιώντας τα σύμβολα "@, a-z, 0-9, /" | sdin create new-project |

| Επιλογή    | Συντόμευση | Τύπος  | Απαιτείται | Προκαθορισμένο          | Περιγραφή                                        | Παράδειγμα                    |
| ---------- | ---------- | ------ | ---------- | ----------------------- | ------------------------------------------------ | ----------------------------- |
| --output   | -o         | string | Όχι        | Τρέχουσα λίστα εργασίας | Καθορισμός της γονικής διαδρομής για το νέο έργο | sdin create -o ./             |
| --template | -t         | string | Όχι        | -                       | Καθορίστε το όνομα προτύπου για το νέο έργο      | sdin create -t common-package |

## Διασύνδεση

### readSdinConfig

Ανάγνωση παραμέτρων έργου

```typescript
function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig>

interface SdinConfigReadingParams {
  /** Κατάλογος ρίζας έργου */
  root: string
}
```

### createSdinProject

Δημιουργία έργου

```typescript
function createSdinProject(options: SdinProjectCreatingOptions): Promise<void>

interface SdinProjectCreatingOptions {
  /** Όνομα προτύπου */
  templateName?: string
  /** Η διαδρομή φακέλου όπου αποθηκεύεται το έργο (προεπιλογή: τρέχοντος κατάλογος εργασίας) */
  projectParentPath?: string
  /** Όνομα έργου */
  projectName?: string
  /** Έκδοση έργου (προεπιλογή: 0.0.1) */
  projectVersion?: string
  /** Περιγραφή έργου */
  projectDescription?: string
  /** Όνομα συγγραφέα (προεπιλεγμένο: όνομα χρήστη Git) */
  authorName?: string
  /** Ηλεκτρονικό ταχυδρομείο συντάκτη (προεπιλεγμένο: ηλεκτρονικό ταχυδρομείο Git) */
  authorEmail?: string
}
```

### buildSdinProject

Οικοδομικό έργο

```typescript
function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void>

interface SdinProjectBuildingOptions {
  /** Ρύθμιση Sdin */
  config: SdinConfig
  /** Καθορίστε το όνομα της ενότητας που πρόκειται να κατασκευαστεί */
  moduleNames?: string[]
}
```
