import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def extract_video_data(video_url, timeout=10):
    """
    Extracts specified metadata (title, duration, plays, id, date) 
    and transcript (if available) from a YouTube video using Selenium and BeautifulSoup.
    Args:
        video_url: The URL of the YouTube video.
        timeout: Maximum time to wait for page elements to load (default 10 seconds).
    Returns:
        A dictionary containing the extracted video data.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(video_url)
        
        WebDriverWait(driver, timeout).until(EC.presence_of_element_located((By.ID, 'content')))
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        video_data = {
            'title': soup.find('meta', property='og:title')['content'] if soup.find('meta', property='og:title') else None,
            'duration': int(re.search(r'lengthSeconds":"(\d+)"', str(soup)).group(1)) if re.search(r'lengthSeconds":"(\d+)"', str(soup)) else None,
            'plays': int(re.search(r'viewCount":{"simpleText":"([^"]+)"', str(soup)).group(1).replace(',', '')) if re.search(r'viewCount":{"simpleText":"([^"]+)"', str(soup)) else None,
            'id': video_url.split('v=')[1],
            'date': soup.find('meta', itemprop='datePublished')['content'] if soup.find('meta', itemprop='datePublished') else None,
        }
        
        try:
            transcript_container = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((By.ID, 'transcript-container'))
            )
            transcript_html = transcript_container.get_attribute('innerHTML')
            soup = BeautifulSoup(transcript_html, 'html.parser')
            transcript_elements = soup.find_all('div', class_='cue')
            video_data['transcript'] = '\n'.join([element.text for element in transcript_elements])
        except:
            video_data['transcript'] = None
        
        return video_data
    except Exception as e:
        print(f"Error processing video: {e}")
        return None
    finally:
        if driver:
            driver.quit()

# Example usage
if __name__ == "__main__":
    video_url = "https://www.youtube.com/watch?v=hf--vE6dVOQ" 
    video_data = extract_video_data(video_url)
    if video_data:
        print(json.dumps(video_data, indent=4))
    else:
        print("Failed to extract video data.")
