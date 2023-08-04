import axios from 'axios';
import xml2json from 'xml2json';
import JSON5 from 'json5';

export default async function handler(_req, res) {
  try {
    const urls = [
      {
        url: "https://www.upwork.com/ab/feed/jobs/rss?sort=recency&and_terms=javascript&paging=0%3B50&api_params=1&q=javascript"
      }
    ];

    const jobs = await getJobsFromRss(urls);

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
}

const getJobsFromRss = async (urls, jobs = []) => {
  try {
    const { url } = urls.pop();
    const { data } = await axios.get(url);
    const json = xml2json.toJson(data);
    const obj = JSON5.parse(json);

    const dataItems = obj.rss.channel.item;
    jobs.push(...dataItems);

    if (urls?.length > 0) {
      await getJobsFromRss(urls, jobs);
    }

    return jobs;
  } catch (error) {
    return error;
  }
}
