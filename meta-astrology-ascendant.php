<?php

/**
 * Plugin Name: Astrology Ascendant
 * Description: Calculates astrology ascendant based on given parameters
 * Author: MilosDj21
 * Version: 1.0
 */

defined('ABSPATH') or die("Cannot access pages directly.");

class AstrologyAscendant {

  function __construct() {
    add_shortcode('renderAstrologyAscendantPlugin', array($this, 'loadPage'));
    add_action('wp_enqueue_scripts', array($this, 'addScripts'));
  }

  function addScripts() {
    wp_enqueue_script('ascendantscript', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-element'));
    wp_enqueue_style('ascendantstyle', plugin_dir_url(__FILE__) . 'build/index.css');
  }

  public function loadPage() {
    ob_start();?>
    <div id="root"></div>
    <?php return ob_get_clean();
  }
}

$astrologyAscendant = new AstrologyAscendant();