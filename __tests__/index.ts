import 'reflect-metadata';
import 'expect-more-jest';

describe('Sanitizer', () => {
  beforeEach(() => {
    // Because `class-sanitizer` stores metadata of all annotated classes in a
    // single, global object, we make sure to get a fresh copy of the
    // module for every test.
    jest.resetModules();
  });

  test('Basic sanitization', async () => {
    const {
      Rtrim,
      Ltrim,
      ToInt,
      ToBoolean,
      NormalizeEmail,
      ToLowerCase,
      ToUpperCase,
      ToString,
      Secure,
      sanitize
    } = await import('../src/index');

    class A {
      @Rtrim() text: string;

      @NormalizeEmail() email: string;

      @Secure() widget: string;

      @Ltrim() bio: string;

      @ToInt() age: any;

      @ToBoolean() isPremium: any;

      @ToLowerCase() color1: string;

      @ToUpperCase() color2: string;

      @ToString({ each: true })
      @ToLowerCase({ each: true })
      tags: string[];
    }

    const a = new A();
    a.bio = ' abcdef';
    a.text = 'test ';
    a.widget = '<b onmouseover=alert("XSS testing!")>Widget</b>';
    a.email = 'EXAMPLE+work@gmail.com';
    a.age = '18';
    a.isPremium = '1';
    a.color1 = '#fFf';
    a.color2 = '#FfF';
    a.tags = ['AAA', 1 as any];

    sanitize(a);

    expect(a.bio).not.toStartWith(' ');
    expect(a.text).not.toEndWith(' ');
    expect(a.widget).toBe('<b>Widget</b>');
    expect(a.email).toBe('example@gmail.com');
    expect(a.age).toBeNumber();
    expect(a.age).toBe(18);
    expect(a.isPremium).toBeBoolean();
    expect(a.isPremium).toBe(true);
    expect(a.color1).toMatch('#fff');
    expect(a.color2).toMatch('#FFF');
    expect(a.tags).toEqual(['aaa', '1']);
  });

  test('Nested objects', async () => {
    const { Trim, ToDate, SanitizeNested, Secure, sanitize } = await import(
      '../src/index'
      );

    class Tag {
      @Trim() name: string;

      @ToDate() createdOn: string | Date;
    }

    class Badge {
      @Trim() name: string;

      @Secure() url: string;
    }

    class Like {
      @Trim() from: string;
    }

    class Post {
      title: string;

      @SanitizeNested() tags: Tag[];

      @SanitizeNested() badge: Badge;

      @SanitizeNested() likes: Map<string, Like>;
    }

    const like1 = new Like();
    like1.from = 'me ';

    const like2 = new Like();
    like2.from = 'you';

    const tag1 = new Tag();
    tag1.name = 'ja';

    const tag2 = new Tag();
    tag2.name = 'node.js ';
    tag2.createdOn = '2010-10-10';

    const badge = new Badge();
    badge.name = '100% ';
    badge.url = 'https://example.com?default=<script>alert(document.cookie)</script>';

    const post1 = new Post();
    post1.title = 'Hello world';
    post1.tags = [tag1, tag2];
    post1.badge = badge;
    post1.likes = new Map<string, Like>([[like1.from, like1], [like2.from, like2]]);

    sanitize(post1);

    expect(post1.tags[1]).toBe(tag2);
    expect(tag2.name).not.toEndWith(' ');
    expect(tag2.createdOn).toBeInstanceOf(Date);
    expect(like1.from).not.toEndWith(' ');
    expect(badge.name).not.toEndWith(' ');
    expect(badge.url).toBe('https://example.com?default=');
  });

  test('Custom sanitizer', async () => {
    const { Sanitize, SanitizerConstraint } = await import('../src/index');

    @SanitizerConstraint()
    class LetterReplacer {
      sanitize(text: string): string {
        return text.replace(/o/g, 'w');
      }
    }

    const { sanitize } = await import('../src/index');

    class Post {
      @Sanitize(LetterReplacer) title: string;
    }

    const post1 = new Post();
    post1.title = 'Hello world';

    sanitize(post1);

    expect(post1.title).toMatch('Hellw wwrld');
  });

  test('Inheritance', async () => {
    const { sanitize, ToInt, Trim, Blacklist, Rtrim } = await import('../src/index');

    class BasePost {
      @ToInt() rating: any;
    }

    class Post extends BasePost {
      @Trim() title: string;

      @Rtrim(['.'])
      @Blacklist(/(1-9)/)
      text: string;
    }

    const post1 = new Post();
    post1.title = ' Hello world ';
    post1.text = '1. this is a great (2) post about hello 3 world.';
    post1.rating = '12.2';

    sanitize(post1);

    expect(post1.title).toMatch('Hello world');
    expect(post1.text).toStartWith(
      '. this is a great  post about hello  world'
    );
    expect(post1.text).not.toEndWith('.');
    expect(post1.rating).toBe(12);
  });

  /* Test for https://github.com/typestack/class-sanitizer/issues/8 */
  test(
    'Two classes that both have a property with the same name are ' +
    'not confused when performing sanitization',
    async () => {
      const { Trim, sanitize } = await import('../src/index');

      class A {
        text: string;
      }

      class B {
        @Trim() text: string;
      }

      const a = new A();
      const b = new B();

      a.text = 'space at the end ';
      b.text = 'space at the end ';

      sanitize(a);
      sanitize(b);

      expect(a.text).toEndWith(' ');
      expect(b.text).not.toEndWith(' ');
    }
  );
});
