import { ArticleCover } from "@/entities/article";
import { LeadMagnet } from "@/features/subscribe-lead";
import { Button, Icon } from "@/shared/ui";

interface ArticleBodyProps {
  /** Slug of the article being read (keys the lead-magnet state). */
  slug: string;
  /** HTML content from API. When present, renders it directly. */
  content?: string;
}

/**
 * Renders article body.
 * - If the API returned HTML content, renders it with dangerouslySetInnerHTML
 *   followed by the LeadMagnet block.
 * - Falls back to the МУИТ case-study mock when no content is provided.
 *
 * NOTE: We do NOT split the HTML string to inject LeadMagnet mid-content.
 * Splitting BlockNote HTML (which starts with nested <div> blocks) causes
 * the browser to auto-repair unclosed tags differently on server vs client,
 * producing a React hydration mismatch. LeadMagnet always renders after
 * the full content block.
 */
export function ArticleBody({ slug, content }: ArticleBodyProps) {
  if (content && content.trim().length > 0) {
    return (
      <div className="prose" id="prose">
        {/*
          suppressHydrationWarning: acceptable for rich HTML from a CMS editor —
          minor whitespace/attribute diffs between server and client are harmless.
        */}
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <LeadMagnet slug={slug} />
      </div>
    );
  }

  // ── Fallback: МУИТ case-study mock ────────────────────────────────────────
  return (
    <div className="prose" id="prose">
      <p>
        Когда в Международном университете информационных технологий (МУИТ) набор
        вырос до полутора тысяч студентов, привычные таблицы и бумажные
        ведомости перестали справляться. Расписание собиралось вручную неделями,
        журнал жил в десятке разных файлов, а оплата сверялась с банковскими
        выписками задним числом.
      </p>
      <p>
        В этом материале — как университет за один семестр перевёл расписание,
        журнал и оплату в единую систему, и что из этого вышло. Без
        приукрашивания: с тем, что получилось сразу, и с тем, что пришлось
        донастраивать по ходу.
      </p>

      <h2 id="s1">С чего всё началось</h2>
      <p>
        Поводом стал не глобальный план цифровизации, а конкретная боль. К
        началу учебного года деканат тратил почти три недели на то, чтобы свести
        расписание для 48 групп так, чтобы преподаватели не пересекались, а
        аудитории не дублировались. Любая замена запускала цепочку правок в
        нескольких документах.
      </p>
      <p>
        Руководство сформулировало задачу просто:{" "}
        <strong>
          одна система, в которой расписание, журнал и финансы связаны между
          собой
        </strong>
        , а не лежат в параллельных мирах.
      </p>

      <div className="callout">
        <div className="callout__icon">
          <Icon name="bolt" />
        </div>
        <div className="callout__body">
          <b>Важно</b>
          Цифровизация начинается не с покупки софта, а с честного списка того,
          что отнимает время у команды каждую неделю. Без этого списка любой
          инструмент превращается в ещё одну вкладку в браузере.
        </div>
      </div>

      <LeadMagnet slug={slug} />

      <h2 id="s2">Что болело до Bilimtrack</h2>
      <p>
        Прежде чем что-то менять, в университете описали реальные процессы.
        Картина оказалась знакомой для большинства учебных организаций:
      </p>
      <ul>
        <li>
          <strong>Расписание</strong> жило в Excel, и каждая замена означала
          ручную правку в нескольких версиях файла.
        </li>
        <li>
          <strong>Журнал</strong> вёлся преподавателями по-разному — кто-то в
          тетради, кто-то в своей таблице.
        </li>
        <li>
          <strong>Оплата</strong> сверялась бухгалтерией вручную по банковским
          выпискам, с задержкой в несколько дней.
        </li>
        <li>
          <strong>Родители и студенты</strong> узнавали об оценках и долгах в
          последний момент.
        </li>
      </ul>
      <p>
        Отдельная проблема — прозрачность. Руководство не видело общую картину в
        реальном времени: чтобы ответить на вопрос «как идёт семестр»,
        приходилось собирать данные из разных источников.
      </p>

      <blockquote>
        Мы не считали, сколько часов уходит на отчётность, пока не увидели цифру.
        Оказалось — почти две полные ставки занимались тем, что система делает
        автоматически.
        <cite>— проректор по учебной работе, МУИТ</cite>
      </blockquote>

      <div className="cta-inline">
        <div className="cta-inline__text">
          <b>Хотите посмотреть, как это работает в вашей организации?</b>
          <span>
            Покажем расписание, журнал и оплату на живом примере — за 20 минут.
          </span>
        </div>
        <Button href="#demo">
          Получить демо
          <Icon name="chevron-right" />
        </Button>
      </div>

      <h2 id="s3">Как проходило внедрение</h2>
      <p>
        Запуск разбили на три этапа и сознательно не пытались включить всё сразу.
        Это снизило сопротивление команды и позволило отладить каждый блок
        отдельно.
      </p>

      <h3>Этап 1. Расписание</h3>
      <p>
        Сначала в систему перенесли структуру: дисциплины, группы,
        преподавателей и аудитории. Расписание с чередованием недель (числитель и
        знаменатель) теперь собирается с проверкой конфликтов — система сама
        подсвечивает пересечения.
      </p>

      <aside className="cta-module">
        <span className="cta-module__icon">
          <Icon name="calendar" />
        </span>
        <p className="cta-module__text">
          <b>Это модуль «Расписание» в Bilimtrack.</b> Сетка с числителем и
          знаменателем, замены и автоматическая проверка конфликтов — соберите
          расписание своих групп на демо.
        </p>
        <a className="cta-module__link" href="#demo">
          Попробовать
          <Icon name="chevron-right" />
        </a>
      </aside>

      <h3>Этап 2. Электронный журнал</h3>
      <p>
        Преподаватели получили единый журнал с понятной шкалой оценок. Привычные
        пятибалльные оценки и отметки посещаемости выставляются в пару кликов, а
        итоги по модулю считаются автоматически.
      </p>

      <figure>
        <ArticleCover cat="cases" cover="journal" />
        <figcaption>
          Журнал в Bilimtrack: оценки и посещаемость в одной сетке, итоги по
          модулю считаются автоматически.
        </figcaption>
      </figure>

      <h3>Этап 3. Оплата</h3>
      <p>
        Последним подключили финансовый модуль. Родители видят сумму и срок
        оплаты в приложении, а бухгалтерия — статус платежей в реальном времени.
        Сверка по выпискам ушла в прошлое.
      </p>

      <h2 id="s4">Результаты за первый семестр</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Показатель</th>
              <th>До</th>
              <th>После</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Сборка расписания</td>
              <td>≈ 3 недели</td>
              <td>2–3 дня</td>
            </tr>
            <tr>
              <td>Бумажная отчётность</td>
              <td>100%</td>
              <td>−70%</td>
            </tr>
            <tr>
              <td>Сверка оплат</td>
              <td>3–5 дней</td>
              <td>в реальном времени</td>
            </tr>
            <tr>
              <td>Прозрачность для родителей</td>
              <td>раз в семестр</td>
              <td>ежедневно</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="s5">Что дальше</h2>
      <p>
        Сейчас университет подключает аналитику по успеваемости и геймификацию
        для студентов — рейтинги и баллы, которые в других организациях заметно
        поднимают вовлечённость. Но главный вывод команды проще:
      </p>
      <p>
        Цифровизация — это не про то, чтобы «внедрить систему». Это про то, чтобы
        вернуть людям время, которое раньше уходило на рутину, и сделать процессы
        видимыми. Всё остальное — следствие.
      </p>
    </div>
  );
}
