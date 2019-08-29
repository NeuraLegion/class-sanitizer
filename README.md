# neuralegion/class-sanitizer

Allows to use decorator and non-decorator based sanitization in your Typescript classes.
Internally uses [validator.js](https://github.com/chriso/validator.js) and [Caja-HTML-Sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer) to make sanitization.

## Table of Contents

 * [Installation](#installation)
 * [Usage](#usage)
    + [Sanitizing arrays](#sanitizing-arrays)
    + [Sanitizing sets](#sanitizing-sets)
    + [Sanitizing maps](#sanitizing-maps)
    + [Sanitizing nested objects](#sanitizing-nested-objects)
    + [Inheriting sanitization decorators](#inheriting-sanitization-decorators)
    + [Custom sanitization classes](#custom-sanitization-classes)
    + [Using service container](#using-service-container)
    + [Manual sanitization](#manual-sanitization)
    + [Sanitization decorators](#sanitization-decorators)
 * [Examples](#examples)

## Installation

`npm install @neuralegion/class-sanitizer --save`

## Usage

Create your class and put some sanity decorators on its properties you want to sanitize:

```typescript
import { sanitize, Trim, Rtrim, Blacklist } from '@neuralegion/class-sanitizer';

export class Post {
  @Trim() title: string;

  @Rtrim(['.'])
  @Blacklist(/(1-9)/)
  text: string;
}

let post1 = new Post();
post1.title = ' Hello world ';
post1.text = '1. this is a great (2) post about hello 3 world.';

sanitize(post);
console.log(post);
// now post will look like this:
// Post {
// title: "Hello world",
// text: ". this is a great  post about hello  world"
// }
```

### Sanitizing arrays

If your field is an array and you want to perform sanitization of each item in the array you must specify a
special `each: true` decorator option:

```typescript
import {Escape} from '@neuralegion/class-sanitizer';

export class Post {

    @Escape({
        each: true
    })
    tags: string[];
}
```

This will sanitize each item in `post.tags` array.

### Sanitizing sets

If your field is an array and you want to perform sanitization of each item in the set you must specify a
special `each: true` decorator option:

```typescript
import {Escape} from '@neuralegion/class-sanitizer';

export class Post {

    @Escape({
        each: true
    })
    tags: Set<string>;
}
```

This will sanitize each item in `post.tags` set.

### Sanitizing maps

If your field is an array and you want to perform sanitization of each item in the map you must specify a
special `each: true` decorator option:

```typescript
import {Escape} from '@neuralegion/class-sanitizer';

export class Post {

    @Escape({
        each: true
    })
    tags: Map<string, string>;
}
```

This will sanitize each item in `post.tags` map.

### Sanitizing nested objects

If your object contains nested objects and you want the sanitizer to perform their sanitization too, then you need to
use the `@SanitizeNested()` decorator:

```typescript
import {SanitizeNested} from '@neuralegion/class-sanitizer';

export class Post {

    @SanitizeNested()
    user: User;

}
```

### Inheriting sanitization decorators

When you define a subclass which extends from another one, the subclass will automatically inherit the parent's decorators. If a property is redefined in the descendant class decorators will be applied on it both from that and the base class.

```typescript
import {sanitize, Blacklist, NormalizeEmail, ToString, Escape} from '@neuralegion/class-sanitizer';

class BaseContent {

    @NormalizeEmail()
    email: string;

    @ToString()
    password: string;
}

class User extends BaseContent {

    @Escape()
    name: string;

    @Blacklist(/(1-9)/)
    password: string;
}

let user = new User();

user.email = 'example+1@example.com';  // inherited property
user.password = 'password'; // password wil be perform not only ToString, but Blacklist as well
user.name = 'Name <a href="/"></a>';

sanitize(user)
```

### Custom sanitization classes

If you have custom sanity logic you want to use as annotations you can do it this way:

1. First create a file, lets say `LetterReplacer.ts`, and create there a new class:

   ```typescript
   import { SanitizerInterface, SanitizerConstraint } from '@neuralegion/class-sanitizer';

   @SanitizerConstraint()
   export class LetterReplacer implements SanitizerInterface {
     sanitize(text: string): string {
       return text.replace(/o/g, 'w');
     }
   }
   ```

   Your class must implement `SanitizerInterface` interface and its `sanitize` method, which defines sanitization logic.

2. Then you can use your new sanitization constraint in your class:

   ```typescript
   import { Sanitize } from '@neuralegion/class-sanitizer';
   import { LetterReplacer } from './LetterReplacer';

   export class Post {
     @Sanitize(LetterReplacer) title: string;
   }
   ```

   Here we set our newly created `LetterReplacer` sanitization constraint for `Post.title`.

3. Now you can use sanitizer as usual:

   ```typescript
   import { sanitize } from '@neuralegion/class-sanitizer';

   sanitize(post);
   ```

### Using service container

Sanitizer supports service container in the case if want to inject dependencies into your custom sanity constraint
classes. Here is example how to integrate it with [typedi](https://github.com/pleerock/typedi):

```typescript
import {Container} from 'typedi';
import {useContainer, Sanitizer} from '@neuralegion/class-sanitizer';

// do this somewhere in the global application level:
useContainer(Container);
let sanitizer = Container.get(Sanitizer);

// now everywhere you can inject Sanitizer class which will go from the container
// also you can inject classes using constructor injection into your custom SanitizerConstraint-s
```

### Manual sanitization

There are several methods in the `Sanitizer` that allows to perform non-decorator based sanitization:

```typescript
import Sanitizer from '@neuralegion/class-sanitizer';

Sanitizer.blacklist(str, chars);
Sanitizer.escape(str);
Sanitizer.secure(str);
Sanitizer.ltrim(str, chars);
Sanitizer.normalizeEmail(str, isLowercase);
Sanitizer.rtrim(str, chars);
Sanitizer.stripLow(str, keepNewLines);
Sanitizer.toBoolean(input, isStrict);
Sanitizer.toDate(input);
Sanitizer.toFloat(input);
Sanitizer.toInt(input, radix);
Sanitizer.toString(input);
Sanitizer.trim(str, chars);
Sanitizer.whitelist(str, chars);
Sanitizer.toUpperCase(str);
Sanitizer.toLowerCase(str);
```

### Sanitization decorators

| Decorator                        | Description                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@Blacklist(chars: RegExp)`      | Remove characters that appear in the blacklist.                                                                                                                          |
| `@Escape()`                      | Replace <, >, &, ', " and / with HTML entities.                                                                                                                          |
| `@Secure()`                      | Strips unsafe tags and attributes from html.                                                                                                                          |
| `@Ltrim()`                       | Trim characters from the left-side of the input.                                                                                                                         |
| `@NormalizeEmail()`              | Canonicalize an email address.                                                                                                                                           |
| `@Rtrim()`                       | Trim characters from the right-side of the input.                                                                                                                        |
| `@StripLow()`                    | Remove characters with a numerical value < 32 and 127, mostly control characters.                                                                                        |
| `@ToBoolean(isStrict?: boolean)` | Convert the input to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.                                  |
| `@ToDate()`                      | Convert the input to a date, or null if the input is not a date.                                                                                                         |
| `@ToFloat()`                     | Convert the input to a float.                                                                                                                                            |
| `@ToInt()`                       | Convert the input to an integer, or NaN if the input is not an integer.                                                                                                  |
| `@ToString()`                    | Convert the input to a string.                                                                                                                                           |
| `@Trim(chars?: string[])`        | Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.                                                      |
| `@Whitelist(chars: RegExp)`      | Remove characters that do not appear in the whitelist.\* The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]'). |
| `@ToUpperCase()`                 | (self-explanatory)                                                                                                                                                       |
| `@ToLowerCase()`                 | (self-explanatory)                                                                                                                                                       |

## Examples

Take a look at [the tests](./__tests__) for more examples of usages.
